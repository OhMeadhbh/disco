CORVER = 0.0.13
MODULES = sn-props sn-core connect@2.24.2
DISCO = ./static/js/disco-core.js ./static/js/prefs.js ./static/js/error.js ./static/js/endpoint.js \
	./static/js/collectable.js ./static/js/positionable.js ./static/js/selectable.js \
	./static/js/style.js ./static/js/icon.js ./static/js/window.js ./static/js/menu.js ./static/js/app.js
FONTS = ./static/fonts/GranaPadano.ttf ./static/fonts/Segment14.otf ./static/fonts/Anonymous\ Pro.ttf

default: ./node_modules ./static/js/sn-core.js ./static/js/disco.js $(FONTS)

clean:
	rm -rf ./node_modules
	rm -rf ./build
	rm -rf ./static/js/disco.js
	rm -rf ./static/js/sn-core.js
	rm -rf $(FONTS)

./node_modules :
	mkdir ./node_modules
	npm install $(MODULES)

./build : 
	mkdir ./build
	if [ ! -d ./static/fonts ]; then mkdir ./static/fonts; fi

./build/v$(CORVER).tar.gz : ./build
	(cd build; wget https://github.com/smithee-us/sn-core/archive/v$(CORVER).tar.gz)

./static/js/sn-core.js : ./build/v$(CORVER).tar.gz
	(cd build; tar xzvf v$(CORVER).tar.gz)
	cp ./build/sn-core-$(CORVER)/sn-core.js static/js/sn-core.js

./build/segment14.zip : ./build
	(cd build; wget http://openfontlibrary.org/assets/downloads/segment14/0b700e9856aeebed3939657aca144801/segment14.zip)

./static/fonts/Segment14.otf : ./build/segment14.zip
	(cd build; unzip segment14.zip)
	cp ./build/hdad-segment14-1.002/Segment14.otf static/fonts/Segment14.otf

./build/grana-padano.zip : ./build
	(cd build; wget http://openfontlibrary.org/assets/downloads/grana-padano/67c44957a5109298272b45dd1fb7c616/grana-padano.zip)

./static/fonts/GranaPadano.ttf : ./build/grana-padano.zip
	(cd build; unzip grana-padano.zip)
	cp ./build/GranaPadano.ttf static/fonts/GranaPadano.ttf

./build/anonymous-pro.zip : ./build
	(cd build; wget http://openfontlibrary.org/assets/downloads/anonymous-pro/bb5141b20b9d69b3190be03e5706c8b7/anonymous-pro.zip)

./static/fonts/Anonymous\ Pro.ttf : ./build/anonymous-pro.zip
	(cd build; unzip anonymous-pro.zip)
	cp ./build/AnonymousPro-1.002.001/Anonymous\ Pro.ttf static/fonts/Anonymous\ Pro.ttf

./static/js/disco.js : $(DISCO)
	echo "( function () { var _private = {};" > ./static/js/disco.js
	cat $(DISCO) >> ./static/js/disco.js
	echo "} ) ();" >> ./static/js/disco.js
