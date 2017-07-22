#!/usr/bin/python

import serial

def main():
	ser = serial.Serial('/dev/ttyAMA0',9600)
	ser.write('Read data from terminal')

	while True:
		c = ser.read()
		print(c)

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
