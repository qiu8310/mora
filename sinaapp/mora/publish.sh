#!/bin/sh
set -e
#shopt -s extglob

# 发布编译后的文件到 SAE 上去


# 默认要发布的文件夹
PUBLISH_FOLDER="1"

# 发布的Comment一定要加上 [skip ci]，防止一些线上工具对此处提交的代码进行分析
PUBLISH_COMMENT="Auto publish [skip ci]"

# 获取要发布的文件夹，如果不带参数就用默认的
if (( $# != 0 )); then
  if [ -d "$1" ]; then
    PUBLISH_FOLDER="$1"
    shift
  fi

  if [ "$1" != "" ]; then
    PUBLISH_COMMENT="$1 [skip ci]"
  fi
fi





# 处理 SVN： 提交到 SAE上
target_dir=$(dirname $0)
target_dir=${target_dir/\./$(pwd)}
cd $target_dir


if [ -d "$PUBLISH_FOLDER" ]; then

  # 处理 svn st 命令
  SVN_STATUS=`svn st`
  LINE_COUNT=0

  # 用 HERE-Document 是为了保证 while 里/外的程序共用 UPDATED 变量，同时避免创建临时文件来保存 SVN_STATUS
  while read line
  do
    if [ "$line" != "" ]; then
      LINE_COUNT=$(($LINE_COUNT + 1))
      if [ ${line:0:2} == "!" ]; then # svn st 中第一个字符是 ! 表示此文件删除了
        `svn del ${line:1} > /dev/null 2>&1 --quiet`
        #echo "svn del ${line:1} > /dev/null 2>&1 --quiet"
      elif [ ${line:0:2} == "1" ]; then # svn st 中第一个字符是 ?(?读入之后就会变成1) 表示此文件是新添加的
        `svn add ${line:1} > /dev/null 2>&1 --quiet`
        #echo "svn add ${line:1} > /dev/null 2>&1 --quiet"
      fi
    fi
  done <<EOF
$SVN_STATUS
EOF
  if [ "$LINE_COUNT" -gt "0" ]; then
    echo "Publishe folder: $PUBLISH_FOLDER"
    echo "Publish comment: $PUBLISH_COMMENT\r\n"
    svn commit -m "$PUBLISH_COMMENT"
  else
    echo "SVN: Nothing to publish"
  fi

fi







# 处理 Git：提交到 github gh-pages 分支上
cd "$PUBLISH_FOLDER/frontend"
git checkout gh-pages --quiet
GIT_STATUS=`git status`
LINE_COUNT=0
while read line
do
  LINE_COUNT=$(($LINE_COUNT + 1))
done <<EOF
$GIT_STATUS
EOF

#结果只有两行的话表示没有任何修改
if [ "$LINE_COUNT" -le "2" ]; then
  echo "GIT: Nothing to publish"
else
  git add . -A
  git commit -m "$PUBLISH_COMMENT"
  git push origin gh-pages
fi
