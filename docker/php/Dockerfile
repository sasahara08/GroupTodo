FROM php:8.3-fpm

RUN apt update \
    && apt install -y zlib1g-dev mariadb-client vim libzip-dev \
    && docker-php-ext-install zip pdo_mysql \
    && apt install -y git

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html
COPY ./backend/backend /var/www/html
COPY docker/php/php.ini /usr/local/etc/php/php.ini
RUN composer install --no-dev --optimize-autoloader
