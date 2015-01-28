'use strict';
/*
 Test resource
 images:
 美女： http://lesson-production.qiniudn.com/connett/dbf9181e-4320-4bf0-8059-41dd56887476?imageView2/2/w/216/h/135
 女头像1：http://lesson-production.qiniudn.com/connett/ef1d9340-0ddc-451f-b5cc-81e663af910f
 女头像2：http://lesson-production.qiniudn.com/connett/24771d44-259d-492a-8786-f1cdd21e68de
 男头像1：http://lesson-production.qiniudn.com/connett/8a1b42af-8fc5-4c43-aacb-20dd8cf62ac3
 男头像2：http://lesson-production.qiniudn.com/connett/b9ce1c9a-18cf-4c5f-b8fc-e692dcba54a8

 http://design-res.qiniudn.com/img__no.svg
 http://design-res.qiniudn.com/img__no.png

 audio:
 http://lesson-production.qiniudn.com/connett/b24c13cd-7133-4206-8e01-7d1d0e5eeafd

 video:
 http://lesson-production.qiniudn.com/connett/3d0cc95e-c9c7-4a5b-9b6f-7f9b38458095

 */
angular.module('moraApp')
  .constant('C', {
    constants: {
      BANNER_TYPE: {
        ACTIVITY: 'huo_dong',
        TEAM: 'study_group',
        COURSE: 'course',
        THREAD: 'forum_topic',
        PODCAST: 'podcast'
      },
      STREAM_TYPE: {
        THREAD: 'forum_topic',
        COURSE_SET: 'course_set',
        TEAM_SET: 'study_group_set',
        SMALL_BANNER: 'banner',
        PODCAST_SET: 'podcast_set'
      }
    },

    app: {
      html5Mode: false,
      hashPrefix: '!'
    },

    res: {
      defaultAvatar: 'http://llss.qiniudn.com/avatar_default.png',
      noImg: 'http://design-res.qiniudn.com/img__no.svg',
      audioPrefix: '?avthumb/mp3/ab/36',
      uploader: 'http://mora.sinaapp.com/utils/uploader.php'
    },

    search: {
      historyLength: 10
    },

    page: {
      baseTitle: '英语流利说CRM系统'
    },

    menu: {
      newTagMaxAge: 6 * 3600 * 1000 // 菜单项上的 `new` 标签保留的时长
    },

    team: {
      categories: [
        {key: '上班族', name: '上班族'},
        {key: '备考党', name: '备考党'},
        {key: '爱看剧', name: '爱看剧'},
        {key: '正能量', name: '正能量'},
        {key: '找同城', name: '找同城'},
        {key: '啥都有', name: '啥都有'}
      ],
      defaultCategory: '上班族'
    },

    smartMenu: [
      {
        key: 'front',
        title: '首页',
        fa: 'home',
        children: [
          {
            key: 'banner',
            title: '主首页轮播图',
            templateUrl: 'front-banner.html'
          },
          {
            key: 'stream',
            title: '主首页瀑布流',
            templateUrl: 'front-stream.html'
          },
          {
            key: 'course',
            title: '课程首页Banner',
            templateUrl: 'front-course.html'
          },
          {
            key: 'podcast',
            title: '播客首页Banner',
            templateUrl: 'front-podcast.html'
          }
        ]
      },
      {
        key: 'team',
        title: '学习小组',
        fa: 'group',

        children: [
          {
            key: 'all',
            title: '所有小组',
            templateUrl: 'team-all.html'
          },
          {
            key: 'tags',
            title: '小组标签',
            templateUrl: 'team-tags.html'
          }
        ]
      },
      {
        key: 'forum',
        title: '流利吧',
        fa: 'comments',

        children: [
          {
            key: 'all',
            title: '所有帖',
            manual: true // 手动注册 state
          },
          {
            key: 'search',
            title: '帖子搜索',
            controller: 'ForumSearchCtrl',
            templateUrl: 'forum-all.html'
            //manual: true
          },
          {
            key: 'hot',
            title: '热门贴',
            templateUrl: 'forum-hot.html'
          },
          {
            key: 'index',
            title: '首页帖子',
            templateUrl: 'forum-index.html'
          }
        ]
      },
      {
        key: 'podcast',
        title: '播客',
        fa: 'microphone',

        children: [
          {
            key: 'all',
            title: '所有播客',
            templateUrl: 'podcast-all.html',
            manual: true
          }
        ]
      },
      {
        key: 'system',
        title: '系统管理',
        fa: 'windows',
        children: [
          {
            key: 'message',
            title: '消息推送',
            templateUrl: 'system-message.html'
          }
        ]
      }
    ]


  });
