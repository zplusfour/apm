build:
	npx pkg . --target host --output bin/apm.exe

build-lin:
	npx pkg . --target linux --output bin/apm.elf

build-macos:
	npx pkg . --target macos --output bin/apm.app

build-all:
	make build; make build-lin; make build-macos

clean-zip:
	rm -f bin/*.zip