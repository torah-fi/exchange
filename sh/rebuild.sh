#!/bin/bash
rm -rf vy/build/contracts/Crypto2BasePool.json
rm -rf test/mock/Crypto2BasePool.json

cd vy
brownie compile
cd ..

cp vy/build/contracts/Crypto2BasePool.json test/mock/Crypto2BasePool.json


