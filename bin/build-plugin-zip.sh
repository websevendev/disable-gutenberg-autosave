#!/bin/bash

set -e # Exit if any command fails

rm -f disable-gutenberg-autosave.zip

zip -r disable-gutenberg-autosave.zip \
	disable-gutenberg-autosave.php \
	readme.txt \
	build/* \
	src/*

unzip disable-gutenberg-autosave.zip -d disable-gutenberg-autosave
rm disable-gutenberg-autosave.zip
zip -r disable-gutenberg-autosave.zip disable-gutenberg-autosave
rm -rf ./disable-gutenberg-autosave
