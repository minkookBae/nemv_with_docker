FROM node:10

COPY ./docker/entrypoint.sh /entrypoint/

ENV NODE_ENV development
RUN ["chmod", "+x", "entrypoint/entrypoint.sh"]

# Copy or mount node app here
WORKDIR /data/

EXPOSE 3000

ENTRYPOINT ["/entrypoint/entrypoint.sh"]

CMD ["npm", "start"]