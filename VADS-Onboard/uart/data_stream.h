#ifndef _DATA_STREAM_H_
#define _DATA_STREAM_H_

#include <csignal>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <errno.h>
#include <fcntl.h>
#include <fstream>
#include <iostream>
#include <memory>
#include <sstream>
#include <sys/file.h>
#include <sys/time.h>
#include <termios.h>
#include <unistd.h>
#include <vector>

#include "AHRS.hpp"

#include "Common/MS5611.h"
#include "Common/Ublox.h"

#include "Navio2/LSM9DS1.h"
#include "Navio2/RCOutput_Navio2.h"

typedef struct termios termios_t;

typedef struct accel_data_s {
	float x;
	float y;
	float z;
} accel_t;

typedef struct gyro_data_s {
	float x;
	float y;
	float z;
} gyro_t;

typedef struct live_data_s {
	float temperature;
	float pressure;
	double latitude;
	double longitude;
	float stemp;
	float pitch;
	float yaw;
	float roll;
	accel_t accel;
	gyro_t gyro;
} ldat;

#endif
