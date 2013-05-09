%.otf : %.sfd
	fontforge -lang=ff -c 'Open($$1);Generate($$1:r+".otf")' $<

.PHONY=clean

TARGETS = Segment14.otf

all : ${TARGETS}

clean:
	rm ${TARGETS}

