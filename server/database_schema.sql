-- Creazione della tabella categories prima per la chiave esterna
create table
  public.categories (
    id uuid not null default gen_random_uuid (),
    name character varying not null,
    slug character varying not null,
    created_at timestamp with time zone not null default now(),
    constraint categories_pkey primary key (id),
    constraint categories_slug_key unique (slug)
  ) tablespace pg_default;

-- Creazione della tabella posts
create table
  public.posts (
    id uuid not null default gen_random_uuid (),
    title character varying not null,
    slug character varying not null,
    content text null,
    header_image text null,
    published boolean not null default false,
    author_id uuid null,
    category_id uuid null,
    created_at timestamp with time zone not null default now(),
    constraint posts_pkey primary key (id),
    constraint posts_slug_key unique (slug),
    constraint public_posts_author_id_fkey foreign key (author_id) references auth.users (id) on delete set null,
    constraint public_posts_category_id_fkey foreign key (category_id) references categories (id) on delete set null
  ) tablespace pg_default;

-- Impostazioni RLS (Row Level Security) opzionali, raccomandate per la sicurezza
-- Abilita RLS
alter table public.posts enable row level security;
alter table public.categories enable row level security;

-- Policy provvisoria per sviluppo: permette lettura pubblica a tutti
create policy "Enable read access for all users" on public.posts for select using (true);
create policy "Enable read access for all users" on public.categories for select using (true);

-- Policy provvisoria per sviluppo: permette tutte le operazioni a chiunque (DA CAMBIARE IN PRODUZIONE)
create policy "Enable ALL access for all users" on public.posts for all using (true);
create policy "Enable ALL access for all users" on public.categories for all using (true);
