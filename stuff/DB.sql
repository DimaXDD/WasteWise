show databases;
create database ecosort;
drop database ecosort;

select * from ecosort.users;        -- таблица пользователей
select * from ecosort.articles;     -- таблица с статьями
select * from ecosort.ratings;      -- комментарии
select * from ecosort.likes;        -- лайки
select * from ecosort.points;       -- таблица с пунктами приема
select * from ecosort.s_keys;       -- ключи от пунктов приема (добавляем ключ, потом пункт)
select * from ecosort.receptions;   -- переписано
select * from ecosort.marks;        -- виды вторсырья
select * from ecosort.check_weight; -- подтверждение сдачи
select * from ecosort.points_marks; -- используется для связи «многие-ко-многим» таблиц points и marks
select * from ecosort.discounts;    -- скидки
select * from ecosort.promo_codes;  -- промокоды

    UPDATE ecosort.users
SET points = 150
WHERE id = 2;

-- Пользователь
CREATE TABLE IF NOT EXISTS ecosort.users (
    id int auto_increment,
    username        varchar(20)               not null,
    email           varchar(100)              not null,
    password_hash   varchar(200)              not null,
    points          int        default 0      null,
    role            varchar(5) default 'user' not null,
    is_activated    tinyint(1) default 0      null,
    activation_link varchar(150)              null,
  constraint users_ck CHECK (role IN ('admin', 'user')),
  constraint email_un unique (email),
  constraint password_hash_un unique (password_hash),
  constraint users_pk primary key (id));
-- Статьи --
CREATE TABLE IF NOT EXISTS ecosort.articles (
    id int auto_increment,
    title       varchar(100)  not null,
    text        text          not null,
    date_of_pub date          not null,
    image_url   varchar(150)  not null,
    author      int           not null,
    likes       int default 0 null,
    constraint articles_pk primary key (id),
    constraint title_un unique (title),
    constraint articles_fk_users foreign key (author) references ecosort.users(id) on delete cascade);
-- Комменты --
CREATE TABLE IF NOT EXISTS ecosort.ratings (
    id          int auto_increment,
    article_id  int          not null,
    commentator int          not null,
    comment     varchar(500) not null,
    date_of_add DATETIME DEFAULT CURRENT_TIMESTAMP,
    constraint ratings_pk primary key (id),
    constraint ratings_fk_users foreign key (commentator) references ecosort.users(id) on delete cascade,
    constraint ratings_fk_articles foreign key (article_id) references ecosort.articles(id) on delete cascade);
-- Лайки --
CREATE TABLE IF NOT EXISTS ecosort.likes(
    id          INT AUTO_INCREMENT,
    user_id     INT NOT NULL,
    article_id  INT NOT NULL,
    date_of_add DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT likes_pk PRIMARY KEY (id),
    CONSTRAINT likes_fk_users FOREIGN KEY (user_id) REFERENCES ecosort.users(id) ON DELETE CASCADE,
    CONSTRAINT likes_fk_articles FOREIGN KEY (article_id) REFERENCES ecosort.articles(id) ON DELETE CASCADE
);
-- Секретный ключ для ПП--
create table IF NOT EXISTS ecosort.s_keys(
    id int auto_increment,
    secret_key varchar(100)  not null,
    is_used    int default 0 not null,
    constraint s_keys_ck CHECK (is_used IN (1,0)),
    constraint s_keys_pk primary key (id));
-- Пункт сдачи --
CREATE TABLE IF NOT EXISTS ecosort.points(
    id           int auto_increment,
    address      varchar(100) not null,
    time_of_work varchar(100) not null,
    key_id       int          not null,
    admin_id     int          not null,
    link_to_map  text         not null,
    point_name   varchar(100) not null,
    constraint address_un unique (address),
    constraint key_id_un unique (key_id),
    constraint point_name_un unique (point_name),
    constraint points_pk primary key (id),
    constraint points_fk_users foreign key (admin_id) references ecosort.users(id) on delete cascade,
    constraint points_fk_s_keys foreign key (key_id) references ecosort.s_keys(id) on delete cascade);
-- Отходы --
CREATE TABLE IF NOT EXISTS ecosort.marks(
    id int auto_increment,
    rubbish varchar(50)  not null,
    points_per_kg int not null,
    new_from_kg float not null,
    image_link varchar(255) null,
    constraint marks_pk primary key (id));
-- Точки сбора с отходами --
CREATE TABLE IF NOT EXISTS ecosort.points_marks(
    id        int auto_increment,
    points_id int not null,
    marks_id  int not null,
    constraint points_marks_pk primary key (id),
    constraint points_marks_fk_points foreign key (points_id) references ecosort.points(id) on delete cascade,
    constraint points_marks_fk_marks foreign key (marks_id) references ecosort.marks(id) on delete cascade);
-- Проверка веса --
CREATE TABLE IF NOT EXISTS ecosort.check_weight(
    id int auto_increment,
    rubbish_id    int          not null,
    weight        int          not null,
    key_of_weight varchar(100) not null,
    is_used INT DEFAULT 0 NOT NULL,
    CONSTRAINT check_weight_is_used_ck CHECK (is_used IN (0, 1)),
    constraint key_of_weight_un unique (key_of_weight),
    constraint check_weight_pk primary key (id),
    constraint check_weight_fk_marks foreign key (rubbish_id) references ecosort.marks(id) on delete cascade);
-- Сдача --
CREATE TABLE IF NOT EXISTS ecosort.receptions(
   id          int auto_increment,
    user_id     int   not null,
    weight      float not null,
    accrued     int   null,
    new_kg      int   null,
    type_waste  int   not null,
    station_key int   not null,
    weight_key  int   not null,
    constraint receptions_pk primary key (id),
    constraint receptions_fk_users foreign key (user_id) references ecosort.users(id) on delete cascade,
    constraint receptions_fk_s_keys foreign key (station_key) references ecosort.s_keys(id) on delete cascade,
    constraint receptions_fk_marks foreign key (type_waste) references ecosort.marks(id) on delete cascade,
    constraint receptions_fk_check_weight foreign key (weight_key) references ecosort.check_weight(id) on delete cascade);
-- Скидки --
CREATE TABLE IF NOT EXISTS ecosort.discounts(
    id int auto_increment,
    discount varchar(50) not null,
    promo_code varchar(50) not null,
    count_for_dnt int not null,
    constraint discount_un unique (discount),
    constraint promo_code_un unique (promo_code),
    constraint discounts_pk primary key (id));
--  Промокоды --
CREATE TABLE IF NOT EXISTS ecosort.promo_codes(
    id int auto_increment,
    promo_code varchar(50) not null,
    user_id int not null,
    discount_id int not null,
    date_of_add DATE not null DEFAULT '2023-05-11',
    constraint discounts_pk primary key (id),
    constraint user_discount_ids_un unique (user_id, discount_id),
    constraint promo_codes_fk_users foreign key (user_id) references ecosort.users (id) on delete cascade,
    constraint promo_codes_fk_discounts foreign key (discount_id) references ecosort.discounts (id) on delete cascade
);


ALTER TABLE ecosort.check_weight
ADD is_used INT DEFAULT 0 NOT NULL,
ADD CONSTRAINT check_weight_is_used_ck CHECK (is_used IN (0, 1));