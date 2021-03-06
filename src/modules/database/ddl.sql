CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '사용자 유일 식별자',
  `name` varchar(255) NOT NULL COMMENT '이름',
  `phone` varchar(16) NOT NULL COMMENT '전화번호',
  `email` varchar(60) DEFAULT NULL COMMENT '이메일',
  `is_used` tinyint(1) NOT NULL DEFAULT '1' COMMENT '사용_여부',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '삭제_여부',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '변경일시',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
  PRIMARY KEY (`id`),
  KEY `idx_mobile` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='사용자 테이블'
;

## 생일 컬럼 추가
ALTER TABLE `rest_template_db`.`user`
ADD COLUMN `birthday` DATE NULL DEFAULT NULL COMMENT '생일' AFTER `email`
;

## phone 컬럼을 UNIQUE INDEX 로 추가
alter table `user` drop index idx_mobile;
alter table `user` add unique index idx_phone (phone);

## 비밀번호 컬럼 추가
alter table `user` add column password varchar(256) default null COMMENT '비밀번호' AFTER `phone`;
