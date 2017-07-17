"""
__author__ = "dhq"
__copyright__ = "Copyright 2017 SwishPi"
__license__ = "GPL V3"
__version__ = "1.0"
"""

from flask import Flask, request, make_response, redirect, render_template
import RPi.GPIO as GPIO
import time

app = Flask(__name__)

R = 11 # LED pin
G = 13
B = 15

"""
	Setups the pins in BCM mode
		
		
	:param none: 
	:returns none : 
"""
def Init():
	GPIO.setwarnings(True) # suppress GPIO used message
	GPIO.setmode(GPIO.BOARD) # use BCM pin numbers
	GPIO.setup(R, GPIO.OUT) # set LED pin as output
	GPIO.setup(G, GPIO.OUT) # set LED pin as output
	GPIO.setup(B, GPIO.OUT) # set LED pin as output
	GPIO.output(R, GPIO.HIGH)
	GPIO.output(G, GPIO.HIGH)
	GPIO.output(B, GPIO.HIGH)

def RedLEDon():
    GPIO.output(R, GPIO.LOW)

def RedLEDoff():
    GPIO.output(R, GPIO.HIGH)

def GreenLEDon():
    GPIO.output(G, GPIO.LOW)
	
def GreenLEDoff():
    GPIO.output(G, GPIO.HIGH)
	
def BlueLEDon():
    GPIO.output(B, GPIO.LOW)

def BlueLEDoff():
    GPIO.output(B, GPIO.HIGH)
	
	
@app.route("/")
def hello():
	print "Welcome to Python Flask!"
	return render_template('index.html')
 
@app.route("/RGB" ,methods=['POST'])
def RGB():
	if request.method == 'POST':
		button = str(request.json['name'])
		bstatus = str(request.json['status'])
		
		if button == 'Red' and bstatus == 'True':
			RedLEDon()
		if button == 'Red' and bstatus == 'False':
			RedLEDoff()
		if button == 'Green' and bstatus == 'True':
			GreenLEDon()
		if button == 'Green' and bstatus == 'False':
			GreenLEDoff()
		if button == "Blue" and bstatus == "True":
			BlueLEDon()
		if button == 'Blue' and bstatus == 'False':
			BlueLEDoff()
			
	return render_template('index.html')
	
if __name__ == "__main__":
	Init()
	app.run(host='0.0.0.0',debug=True)
	