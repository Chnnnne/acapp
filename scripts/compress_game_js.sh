#! /bin/bash

JS_PATH=/home/wangchend/acapp/game/static/js/
JS_PATH_DIST=${JS_PATH}dist/
JS_PATH_SRC=${JS_PATH}src/

# 把src下所有的js文件(注意忽略文件夹和.swp文件) 集中到dist文件夹里的game.js文件
find ${JS_PATH_SRC} -type f -name '*.js' | sort | xargs cat > ${JS_PATH_DIST}game.js
