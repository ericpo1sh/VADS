CXX ?= g++
CFLAGS = -std=gnu++11
LDFLAGS = -lnavio -lrt -lpthread -lpigpio -lboost_system -lssl -lcrypto

LIBDIR := $(CURDIR)/Navio
PIGPIODIR := $(LIBDIR)/pigpio
SOURCEDIR := $(CURDIR)
BUILDDIR := $(CURDIR)/build

INCLUDES := -I$(LIBDIR) -I$(PIGPIODIR)
LIB_INCLUDES := -L$(LIBDIR) -L$(PIGPIODIR)

MODULES := $(wildcard $(SOURCEDIR)/*.cpp)
EXECUTABLES := $(patsubst %, $(BUILDDIR)/%, $(notdir $(MODULES:.cpp=)))

.PHONY: all lib clean

# all: $(EXECUTABLES)

all: VADS_data_stream pwm

lib:
	$(MAKE) -C $(LIBDIR) all

$(BUILDDIR)/%: $(TESTDIR)/%.cpp lib
	@mkdir -p $(BUILDDIR)
	$(CXX) $(CFLAGS) $(INCLUDES) $< $(LIB_INCLUDES) $(LDFLAGS) -o $@

VADS_data_stream: $(SOURCEDIR)/VADS_data_stream.cpp lib
	@mkdir -p $(BUILDDIR)
	$(CXX) $(CFLAGS) $(INCLUDES) $< $(LIBDIR)/AHRS.cpp $(SOURCEDIR)/VADS_live_data.cpp $(SOURCEDIR)/websocket.cpp $(LIB_INCLUDES) $(LDFLAGS) -o $(BUILDDIR)/$@

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
