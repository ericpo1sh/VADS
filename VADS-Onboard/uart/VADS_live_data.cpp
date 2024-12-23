#include "VADS_live_data.hpp"
#include <iomanip>

/**
 * VADS_live_data::VADS_live_data - class constructor
 */
VADS_live_data::VADS_live_data(void) {
	latitude[0] = '0';
	longitude[0] = '0';
}

/**
 * VADS_live_data::read_MS5611 - retrieves ambient temperature and barometric
 *                               pressure readings from MS5611 sensor
 */
void VADS_live_data::read_MS5611(void) {
	static MS5611 barometer;
	static int config{0};

	if (!config) {
		barometer.initialize();
		config = 1;
	}
	barometer.refreshPressure();
	usleep(10000);
	barometer.readPressure();
	barometer.refreshTemperature();
	usleep(10000);
	barometer.readTemperature();
	barometer.calculatePressureAndTemperature();
	pressure = barometer.getPressure();
	temperature = barometer.getTemperature();
}

/**
 * VADS_live_data::update_gps - retrieves GPS coordinates from Ublox module
 */
void VADS_live_data::update_gps(void) {
	static Ublox gps;
	static std::vector<double> position;
	static int config{0};

	if (!config && gps.configureSolutionRate(1000)) {
		std::cerr << "Failed to set GPS rate: EXITING" << std::endl;
		exit(1);
	}
	if (gps.decodeSingleMessage(Ublox::NAV_POSLLH, position)) {
		if (position[2])
			snprintf(latitude, 11, "%lf", position[2] / 10000000);
		if (position[1])
			snprintf(longitude, 11, "%lf", position[1] / 10000000);
	}
	usleep(200);
}

/**
 * VADS_live_data::update_stemp - retrieves Raspberry Pi onboard temperature
 */
void VADS_live_data::update_stemp(void) {
	std::ifstream stemp_file("/sys/class/thermal/thermal_zone0/temp");
	std::stringstream buff;

	buff << stemp_file.rdbuf();
	stemp_file.close();
	stemp = std::stof(buff.str());
	stemp /= 1000;
}

/**
 * VADS_live_data::update_ahrs - retrieves pitch, yaw, and roll values as well
 *                               as accelerometer and gyrometer readings from
 *                               LSM9DS1 IMU sensor
 */
void VADS_live_data::update_ahrs(void) {
	static std::unique_ptr <AHRS> ahrs;
	static std::unique_ptr <InertialSensor> imu;
	static int config{0};

	if (!config) {
		imu = std::unique_ptr <InertialSensor> { new LSM9DS1() };
		imu->initialize();
		ahrs = std::unique_ptr <AHRS> { new AHRS(move(imu)) };
		ahrs->setGyroOffset();
		config = 1;
	}
	ahrs->getAccel(&accel.x, &accel.y, &accel.z);
	ahrs->getGyro(&gyro.x, &gyro.y, &gyro.z);
	imu_update(ahrs.get());
}

/**
 * VADS_live_data::imu_update - measures, updates, and retrieves current IMU
 *                              readings from LSM9DS1 IMU sensor
 * @ahrs: 
 */
void VADS_live_data::imu_update(AHRS *ahrs) {
	float roll_tmp, pitch_tmp, yaw_tmp, dt;
	struct timeval tv;
	static float maxdt, mindt = 0.01, dtsumm = 0;
	static int is_first = 1;
	static unsigned long previoustime, currenttime;

	gettimeofday(&tv, nullptr);
	previoustime = currenttime;
	currenttime = 1000000 * tv.tv_sec + tv.tv_usec;
	dt = (currenttime - previoustime) / 1000000.0;
	if (dt < 1 / 1300.0)
		usleep((1 / 1300.0 - dt) * 1000000);
	gettimeofday(&tv, nullptr);
	currenttime = 1000000 * tv.tv_sec + tv.tv_usec;
	dt = (currenttime - previoustime) / 1000000.0;
	ahrs->updateIMU(dt);
	ahrs->getEuler(&roll_tmp, &pitch_tmp, &yaw_tmp);
	if (!is_first) {
		if (dt > maxdt)
			maxdt = dt;
		else if (dt < mindt)
			mindt = dt;
	}
	is_first = 0;
	dtsumm += dt;
	if (dtsumm > 0.05) {
		pitch = pitch_tmp;
		yaw = yaw_tmp * -1;
		roll = roll_tmp;
		dtsumm = 0;
	}
}

/**
 * VADS_live_data::get_json - serialization of class attributes that represent
 *                            sensor readings for output over serial connection
 *                            and websocket
 * Return: assembled string from stringstream
 */
std::string VADS_live_data::get_json(void) {
	static std::stringstream out;

	out.str(std::string());
	out << "{\"temperature\":\"" << temperature
		<< "\",\"pressure\":\"" << pressure
		<< "\",\"latitude\":\"" << latitude
		<< "\",\"longitude\":\"" << longitude
		<< "\",\"stemp\":\"" << stemp
		<< "\",\"pitch\":\"" << pitch
		<< "\",\"yaw\":\"" << yaw
		<< "\",\"roll\":\"" << roll
		<< "\",\"accel\":{\"x\":\"" << accel.x
		<< "\",\"y\":\"" << accel.y
		<< "\"}}\n";
	return out.str();
}
