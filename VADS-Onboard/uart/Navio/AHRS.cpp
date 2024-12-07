/**
 * This code is provided under the BSD license.
 * Copyright (c) 2014, Emlid Limited. All rights reserved.
 * Adapted from code written by Igor Vereninov and Mikhail Avkhimenia
 *
 * Application: Mahory AHRS algorithm supplied with data from LSM9DS1.
 *
 */

#include <arpa/inet.h>
#include <memory>
#include <netinet/in.h>
#include <stdint.h>
#include <stdio.h>
#include <string>
#include <sys/time.h>
#include <unistd.h>

#include "AHRS.hpp"

#include <Common/MPU9250.h>
#include <Common/Util.h>
#include <Navio2/LSM9DS1.h>

#define G_SI 9.80665
#define PI   3.14159

AHRS::AHRS(std::unique_ptr <InertialSensor> imu) {
	sensor = move(imu);
	q0 = 1, q1 = 0, q2 = 0, q3 = 0, twoKi = 0, twoKp =2;
}

void AHRS::update(float dt) {
	float recipNorm;
	float q0q0, q0q1, q0q2, q0q3, q1q1, q1q2, q1q3, q2q2, q2q3, q3q3;
	float hx, hy, bx, bz;
	float halfvx, halfvy, halfvz, halfwx, halfwy, halfwz;
	float halfex, halfey, halfez;
	float qa, qb, qc;

	float ax, ay, az;
	float gx, gy, gz;
	float mx, my, mz;

	sensor->update();
	sensor->read_accelerometer(&ax, &ay, &az);
	sensor->read_gyroscope(&gx, &gy, &gz);
	sensor->read_magnetometer(&mx, &my, &mz);
	// Use IMU algorithm if magnetometer measurement invalid (avoids NaN in magnetometer normalisation)
	if ((mx == 0.0f) && (my == 0.0f) && (mz == 0.0f)) {
		updateIMU(dt);
		return;
	}
	// Compute feedback only if accelerometer measurement valid (avoids NaN in accelerometer normalisation)
	if (!((ax == 0.0f) && (ay == 0.0f) && (az == 0.0f))) {
		// Normalise accelerometer measurement
		recipNorm = invSqrt(ax * ax + ay * ay + az * az);
		ax *= recipNorm, ay *= recipNorm, az *= recipNorm;
		// Normalise magnetometer measurement
		recipNorm = invSqrt(mx * mx + my * my + mz * mz);
		mx *= recipNorm, my *= recipNorm, mz *= recipNorm;
		// Auxiliary variables to avoid repeated arithmetic
		q0q0 = q0 * q0, q0q1 = q0 * q1,	q0q2 = q0 * q2, q0q3 = q0 * q3;
		q1q1 = q1 * q1,	q1q2 = q1 * q2,	q1q3 = q1 * q3,	q2q2 = q2 * q2;
		q2q3 = q2 * q3,	q3q3 = q3 * q3;
		// Reference direction of Earth's magnetic field
		hx = 2.0f * (mx * (0.5f - q2q2 - q3q3) + my * (q1q2 - q0q3) + mz * (q1q3 + q0q2));
		hy = 2.0f * (mx * (q1q2 + q0q3) + my * (0.5f - q1q1 - q3q3) + mz * (q2q3 - q0q1));
		bx = sqrt(hx * hx + hy * hy);
		bz = 2.0f * (mx * (q1q3 - q0q2) + my * (q2q3 + q0q1) + mz * (0.5f - q1q1 - q2q2));
		// Estimated direction of gravity and magnetic field
		halfvx = q1q3 - q0q2, halfvy = q0q1 + q2q3,	halfvz = q0q0 - 0.5f + q3q3;
		halfwx = bx * (0.5f - q2q2 - q3q3) + bz * (q1q3 - q0q2);
		halfwy = bx * (q1q2 - q0q3) + bz * (q0q1 + q2q3);
		halfwz = bx * (q0q2 + q1q3) + bz * (0.5f - q1q1 - q2q2);
		// Error is sum of cross product between estimated direction and measured direction of field vectors
		halfex = (ay * halfvz - az * halfvy) + (my * halfwz - mz * halfwy);
		halfey = (az * halfvx - ax * halfvz) + (mz * halfwx - mx * halfwz);
		halfez = (ax * halfvy - ay * halfvx) + (mx * halfwy - my * halfwx);
		// Compute and apply integral feedback if enabled
		if (twoKi > 0.0f) {
			integralFBx += twoKi * halfex * dt;	// integral error scaled by Ki
			integralFBy += twoKi * halfey * dt;
			integralFBz += twoKi * halfez * dt;
			gx += integralFBx, gy += integralFBy, gz += integralFBz; // apply integral feedback
		}
		else
			integralFBx = 0.0f, integralFBy = 0.0f, integralFBz = 0.0f; // prevent integral windup
		// Apply proportional feedback
		gx += twoKp * halfex, gy += twoKp * halfey,	gz += twoKp * halfez;
	}
	// Integrate rate of change of quaternion
	gx *= (0.5f * dt);		// pre-multiply common factors
	gy *= (0.5f * dt);
	gz *= (0.5f * dt);
	qa = q0;
	qb = q1;
	qc = q2;
	q0 += (-qb * gx - qc * gy - q3 * gz);
	q1 += (qa * gx + qc * gz - q3 * gy);
	q2 += (qa * gy - qb * gz + q3 * gx);
	q3 += (qa * gz + qb * gy - qc * gx);
	// Normalise quaternion
	recipNorm = invSqrt(q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3);
	q0 *= recipNorm;
	q1 *= recipNorm;
	q2 *= recipNorm;
	q3 *= recipNorm;
}

void AHRS::updateIMU(float dt) {
	float recipNorm;
	float halfvx, halfvy, halfvz;
	float halfex, halfey, halfez;
	float qa, qb, qc;
	float ax, ay, az;
	float gx, gy, gz;

	// Accel + gyro.
	sensor->update();
	sensor->read_accelerometer(&ax, &ay, &az);
	sensor->read_gyroscope(&gx, &gy, &gz);
	ax /= G_SI;
	ay /= G_SI;
	az /= G_SI;
	gx *= (180 / PI) * 0.0175;
	gy *= (180 / PI) * 0.0175;
	gz *= (180 / PI) * 0.0175;
	gx -= gyroOffset[0];
	gy -= gyroOffset[1];
	gz -= gyroOffset[2];
	// Compute feedback only if accelerometer measurement valid (avoids NaN in accelerometer normalisation)
	if (!((ax == 0.0f) && (ay == 0.0f) && (az == 0.0f))) {
		// Normalise accelerometer measurement
		recipNorm = invSqrt(ax * ax + ay * ay + az * az);
		ax *= recipNorm;
		ay *= recipNorm;
		az *= recipNorm;
		// Estimated direction of gravity and vector perpendicular to magnetic flux
		halfvx = q1 * q3 - q0 * q2;
		halfvy = q0 * q1 + q2 * q3;
		halfvz = q0 * q0 - 0.5f + q3 * q3;
		// Error is sum of cross product between estimated and measured direction of gravity
		halfex = (ay * halfvz - az * halfvy);
		halfey = (az * halfvx - ax * halfvz);
		halfez = (ax * halfvy - ay * halfvx);
		// Compute and apply integral feedback if enabled
		if (twoKi > 0.0f) {
			integralFBx += twoKi * halfex * dt;	// integral error scaled by Ki
			integralFBy += twoKi * halfey * dt;
			integralFBz += twoKi * halfez * dt;
			gx += integralFBx;	// apply integral feedback
			gy += integralFBy;
			gz += integralFBz;
		}
		else {
			integralFBx = 0.0f;	// prevent integral windup
			integralFBy = 0.0f;
			integralFBz = 0.0f;
		}
		// Apply proportional feedback
		gx += twoKp * halfex;
		gy += twoKp * halfey;
		gz += twoKp * halfez;
	}
	// Integrate rate of change of quaternion
	gx *= (0.5f * dt);		// pre-multiply common factors
	gy *= (0.5f * dt);
	gz *= (0.5f * dt);
	qa = q0;
	qb = q1;
	qc = q2;
	q0 += (-qb * gx - qc * gy - q3 * gz);
	q1 += (qa * gx + qc * gz - q3 * gy);
	q2 += (qa * gy - qb * gz + q3 * gx);
	q3 += (qa * gz + qb * gy - qc * gx);
	// Normalise quaternion
	recipNorm = invSqrt(q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3);
	q0 *= recipNorm;
	q1 *= recipNorm;
	q2 *= recipNorm;
	q3 *= recipNorm;
}

void AHRS::setGyroOffset(void) {
	//---------------------- Calculate the offset -----------------------------
	float offset[3] = {0.0, 0.0, 0.0};
	float gx, gy, gz;
	//----------------------- MPU initialization ------------------------------
	sensor->initialize();
	//-------------------------------------------------------------------------
	// printf("Beginning Gyro calibration...\n");
	for (int i = 0; i < 100; i++) {
		sensor->update();
		sensor->read_gyroscope(&gx, &gy, &gz);
		gx *= 180 / PI;
		gy *= 180 / PI;
		gz *= 180 / PI;
		offset[0] += gx * 0.0175;
		offset[1] += gy * 0.0175;
		offset[2] += gz * 0.0175;
		usleep(10000);
	}
	offset[0] /= 100.0;
	offset[1] /= 100.0;
	offset[2] /= 100.0;
	// printf("Offsets are: %f %f %f\n", offset[0], offset[1], offset[2]);
	gyroOffset[0] = offset[0];
	gyroOffset[1] = offset[1];
	gyroOffset[2] = offset[2];
}

void AHRS::getEuler(float *roll, float *pitch, float *yaw) {
   *roll = atan2(2 * (q0 * q1 + q2 * q3), 1 - 2 * (q1 * q1 + q2 * q2)) * 180.0 / M_PI;
   *pitch = asin(2 * (q0 * q2 - q3 * q1)) * 180.0 / M_PI;
   *yaw = atan2(2 * (q0 * q3 + q1 * q2), 1 - 2 * (q2 * q2 + q3 * q3)) * 180.0 / M_PI;
}

float AHRS::invSqrt(float x) {
	float halfx = 0.5f * x;
	float y = x;
	long i = *(long*)&y;

	i = 0x5f3759df - (i>>1);
	y = *(float*)&i;
	y = y * (1.5f - (halfx * y * y));
	return y;
}

float AHRS::getW() { return  q0; }

float AHRS::getX() { return  q1; }

float AHRS::getY() { return  q2; }

float AHRS::getZ() { return  q3; }
