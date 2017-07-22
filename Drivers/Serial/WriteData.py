#!/usr/bin/python

import serial

def main():
	ser = serial.Serial('/dev/ttyAMA0',115200,timeout=3) 	# Open the serial port
	ser.write("SwishPi serial communication Demo\n")					# Write a serial string to the serial port
	print "Serial port closed"
	ser.close()											# Close the serial port


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("")
		

"""
__author__ = "dhq"
__copyright__ = "Copyright 2017 SwishPi"
__license__ = "GPL V3"
__version__ = "1.0"
"""
