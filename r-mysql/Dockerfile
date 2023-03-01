
FROM --platform=linux/x86_64 mysql:latest

#####################################
# Set Timezone
#####################################
ARG TC=UTC
ENV TC=${TC}

ENV AUTO_RUN_DIR /docker-entrypoint-initdb.d
ENV INSTALL_DB_SQL init_database.sql

COPY ./$INSTALL_DB_SQL $AUTO_RUN_DIR/
COPY my.cnf /etc/mysql/conf.d/my.cnf
RUN chmod 777 $AUTO_RUN_DIR/$INSTALL_DB_SQL
CMD ["mysqld"]

EXPOSE 3306