create table blogs(
  id SERIAL PRIMARY KEY,
  author varchar(100),
  url varchar(200) NOT NULL,
  title varchar(100) NOT NULL,
  likes int default 0
);
insert into blogs (author, url, title, likes)
values ('test', 'testUrl', 'testTitle', 0),
  ('test', 'testUrl1', 'testTitle1', 0);
select *
from blogs;
