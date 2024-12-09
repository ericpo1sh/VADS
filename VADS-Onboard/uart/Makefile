CXX ?= g++
CFLAGS = -std=gnu++11
LDFLAGS = -lnavio -lrt -lpthread -lpigpio

LIBDIR := $(CURDIR)/Navio
PIGPIODIR := $(LIBDIR)/pigpio
SOURCEDIR := $(CURDIR)
BUILDDIR := $(CURDIR)/build
TESTDIR := $(CURDIR)/serial_test

INCLUDES := -I$(LIBDIR) -I$(PIGPIODIR)
LIB_INCLUDES := -L$(LIBDIR) -L$(PIGPIODIR)

MODULES := $(wildcard $(SOURCEDIR)/*.cpp)
EXECUTABLES := $(patsubst %, $(BUILDDIR)/%, $(notdir $(MODULES:.cpp=)))

.PHONY: all lib clean

# all: $(EXECUTABLES)

all: data_stream pwm

lib:
	$(MAKE) -C $(LIBDIR) all

$(BUILDDIR)/%: $(TESTDIR)/%.cpp lib
	@mkdir -p $(BUILDDIR)
	$(CXX) $(CFLAGS) $(INCLUDES) $< $(LIB_INCLUDES) $(LDFLAGS) -o $@

data_stream: $(SOURCEDIR)/data_stream.cpp lib
	@mkdir -p $(BUILDDIR)
	$(CXX) $(CFLAGS) $(INCLUDES) $< $(LIBDIR)/AHRS.cpp $(LIB_INCLUDES) $(LDFLAGS) -o $(BUILDDIR)/$@

pwm: $(SOURCEDIR)/pwm_test.cpp lib
	@mkdir -p $(BUILDDIR)
	$(CXX) $(CFLAGS) $(INCLUDES) $< $(LIB_INCLUDES) $(LDFLAGS) -o $(BUILDDIR)/$@

test_receiver: $(SOURCEDIR)/uart_receiver_test.cpp
	$(CXX) $(CFLAGS) $< -o $(BUILDDIR)/$@

test_sender: $(SOURCEDIR)/uart_sender_test.cpp
	$(CXX) $(CFLAGS) $< -o $(BUILDDIR)/$@

clean:
	$(MAKE) -C $(LIBDIR) clean
	rm -rf $(BUILDDIR)
