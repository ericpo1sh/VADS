#ifndef _LIVE_DATA_HPP_
#define _LIVE_DATA_HPP_

#include "data_stream.h"

class live_data {
private:
	float temperature = 0.f;
	float pressure = 0.f;
	long double latitude = 0.0;
	long double longitude = 0.0;
	float stemp = 0.f;
	float pitch = 0.f;
	float yaw = 0.f;
	float roll = 0.f;
	accel_t accel = {0.f, 0.f, 0.f};
	gyro_t gyro = {0.f, 0.f, 0.f};
public:
	live_data();

	void read_MS5611();
	void update_gps();
	void update_stemp();
	void update_ahrs();
	void imu_update(AHRS *ahrs);
	std::string get_json();
};

#endif
