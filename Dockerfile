#Stage1- convert src code to javascript.
# FROM node:14-alpine AS stage1
FROM node:14-slim AS stage1
ENV NODE_ENV local
WORKDIR /app
# ADD *.crt /usr/local/share/ca-certificates/
# RUN apk update && apk add ca-certificates && rm -rf /var/cache/apk/*

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
RUN update-ca-certificates
COPY . /app
# RUN npm config set strict-ssl=false
RUN npm install
RUN npm run tsc

#Stage2- copy compiled source from stage 1 and install only prod dependencies.
FROM node:14-slim AS stage2
ENV NODE_ENV local
WORKDIR /app
# ADD *.crt /usr/local/share/ca-certificates/
# RUN apk update && apk add ca-certificates && rm -rf /var/cache/apk/*

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
RUN update-ca-certificates
COPY --from=stage1 ./app/dist ./dist
#NOT COPIED .ENV FILE - ENVIROMENT VAR NEEDS TO BE PASSED IN DOCKER RUN COMMAND

# COPY src/certificates /app
# COPY .npmrc .npmrc  
COPY package* ./
RUN npm config set strict-ssl=false
RUN npm install --only=production
# RUN rm -f .npmrc
EXPOSE 80
CMD ["npm","start"]
