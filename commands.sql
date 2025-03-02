CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

insert into blogs (author, url, title) values ('test author1', 'url 1' , 'title 1');
insert into blogs (author, url, title) values ('test author2', 'url 2' , 'title 2');

insert into users (username, name) values ('admin', 'admin1');