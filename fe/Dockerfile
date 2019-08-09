FROM node:10

COPY ./docker/entrypoint.sh /entrypoint/

RUN npm install -g yarn
RUN ["chmod", "+x", "entrypoint/entrypoint.sh"]

# Copy or mount node app here
WORKDIR /data/

EXPOSE 8080

ENTRYPOINT ["/entrypoint/entrypoint.sh"]

CMD ["yarn", "serve"]