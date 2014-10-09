#!/bin/sh
set -e
#shopt -s extglob

# 发布编译后的文件到 SAE 上去


# 默认要发布的文件夹
PUBLISH_FOLDER="1"

PUBLISH_COMMENT="Auto publish"

# 获取要发布的文件夹，如果不带参数就用默认的
if (( $# != 0 )); then
  if [ -d "$1" ]; then
    PUBLISH_FOLDER="$1"
    shift
  fi

  if [ "$1" != "" ]; then
    PUBLISH_COMMENT="$1"
  fi

fi



# 跳转到 SVN 根目录下去
target_dir=$(dirname $0)
target_dir=${target_dir/\./$(pwd)}
cd $target_dir

if [ -d "$PUBLISH_FOLDER" ]; then
  # 处理 svn st 命令
  svn st | while read line
  do
    updated=1
    if [ ${line:0:2} == "!" ]; then # svn st 中第一个字符是 ! 表示此文件删除了
      `svn del ${line:1} > /dev/null 2>&1 --quiet`
      #echo "svn del ${line:1} > /dev/null 2>&1 --quiet"
    elif [ ${line:0:2} == "1" ]; then # svn st 中第一个字符是 ?(?读入之后就会变成1) 表示此文件是新添加的
      `svn add ${line:1} > /dev/null 2>&1 --quiet`
      #echo "svn add ${line:1} > /dev/null 2>&1 --quiet"
    fi
  done

  if [ updated == "1" ]; then
    echo "Publishe folder: $PUBLISH_FOLDER"
    echo "Publish comment: $PUBLISH_COMMENT\r\n"
    svn commit -m "$PUBLISH_COMMENT"
  else
    echo "Nothing to publish"
  fi
fi
