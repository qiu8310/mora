--
-- 表的结构 `m_option`
--

DROP TABLE IF EXISTS `m_option`;
CREATE TABLE IF NOT EXISTS `m_option` (
  `key` varchar(30) NOT NULL COMMENT '关键字',
  `val` text NOT NULL COMMENT '对应的值',
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最近更新时间',
  `ext` varchar(200) DEFAULT NULL COMMENT '附加字段，用于说明这个关键字的含义',
  PRIMARY KEY (`key`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `m_option`
--

INSERT INTO `m_option` (`key`, `val`, `update_at`, `ext`) VALUES
  ('home_router_ip', '112.65.211.137', '2014-02-21 20:00:07', '');