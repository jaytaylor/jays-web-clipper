REPORTER = spec

all: jshint test

jshint:
	jshint lib examples test index.js

tap:
	NODE_ENV=test ./node_modules/.bin/mocha -R tap > results.tap

test:
	NODE_ENV=test ./node_modules/.bin/mocha --recursive --reporter $(REPORTER) --timeout 3000

tests: test

unit:
	NODE_ENV=test ./node_modules/.bin/mocha --recursive --reporter xunit > results.xml --timeout 3000

skel:
	mkdir -p examples lib test
	test -e index.js || touch index.js
	npm install --save-dev mocha chai

clean:
	rm -f results.tap results.xml

.PHONY: test tap unit jshint skel
