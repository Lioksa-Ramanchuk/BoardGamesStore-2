use BGSTORE;
-- drop table ordered_items;
-- drop table orders;
-- drop table favourite_items;
-- drop table cart_items;
-- drop table clients;
-- drop table accounts;
-- drop table items;
go
create table items
(
  id int identity(1,1) not null primary key,
  title nvarchar (255) not null,
  description nvarchar(MAX) not null,
  rules nvarchar(MAX) not null,
  price money check (price >= 0) not null,
  quantity int check (quantity >= 0) not null,
  category nvarchar(255) not null,
  image nvarchar(MAX) not null,
  publisher nvarchar(255) not null,
  year int check (year >= 0) not null,
  min_players int check (min_players >= 1) not null,
  max_players int check (max_players >= 1) not null,
  avg_play_time int check (avg_play_time >= 0) not null,
  player_min_age int check (player_min_age >= 0) not null,
  is_available bit not null default 1,
  constraint chk_players_range check (max_players >= min_players)
);
go
create table roles
(
  id int identity(1,1) not null primary key,
  title nvarchar(255) not null unique
);
go
create table order_statuses
(
  id int identity(1,1) not null primary key,
  title nvarchar(255) not null unique
);
go
create table accounts
(
  id int identity(1,1) not null primary key,
  role_id int not null references roles(id) on delete cascade,
  login nvarchar(255) not null unique,
  password nvarchar(MAX) not null,
  fullname nvarchar(MAX) not null,
  email nvarchar(MAX) not null,
  is_active bit default 1 not null
);
go
create table clients
(
  id int identity(1,1) not null primary key,
  account_id int not null references accounts (id) on delete cascade unique,
  address nvarchar(MAX) not null
);
go
create table cart_items
(
  id int identity(1,1) not null primary key,
  account_id int not null references accounts (id) on delete cascade,
  item_id int not null references items (id) on delete cascade,
  quantity int default 1 check (quantity > 0) not null
);
go
create table favourite_items
(
  id int identity(1,1) not null primary key,
  account_id int not null references accounts (id) on delete cascade,
  item_id int not null references items (id) on delete cascade,
);
go
create table orders
(
  id int identity(1,1) not null primary key,
  account_id int not null references accounts (id) on delete cascade,
  code nvarchar (255) not null unique,
  order_date datetime not null default getutcdate(),
  status_id int not null references order_statuses (id) on delete cascade,
  order_comment nvarchar(MAX) not null,
  client_fullname nvarchar(MAX) not null,
  client_email nvarchar(MAX)not null,
  client_address nvarchar(MAX) not null
);
go
create table ordered_items
(
  id int identity(1,1) not null primary key,
  order_id int not null references orders (id) on delete cascade,
  item_id int not null references items (id) on delete cascade,
  price money check (price >= 0) not null,
  quantity int check (quantity > 0) not null
)
go