Touch Screen Bulletin Board System with Content Management and Interactive Map

Getting Started:

1.) Run `composer update`

```
#!

cd path\to\project\Thesis
composer update
```

2.) Create database

```
#!

cd path\to\project\Thesis
php app/console doctrine:database:create
```

3.) Run "doctrine:schema:update --force"


```
#!

cd path\to\project\Thesis
php app/console doctrine:schema:update --force
```

4.) Create admin using "fos:user:create" and fill up username, email and password
```
#!

cd path\to\project\Thesis
php app/console fos:user:create
```
5.) Promote the account to admin using "fos:user:promote" and enter "ROLE_ADMIN"
```
#!

cd path\to\project\Thesis
php app/console fos:user:promote
```

6.) Promote the account to super admin using "fos:user:promote" and enter "ROLE_SUPER_ADMIN"
```
#!

cd path\to\project\Thesis
php app/console fos:user:promote
```