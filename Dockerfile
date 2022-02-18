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
# ADD *.crt /usr/local/share/ca-certificates/
# RUN apk update && apk add ca-certificates && rm -rf /var/cache/apk/*

RUN apt-get update \
    && apt-get install -y ca-certificates \
    && apt-get install -y curl \
    && update-ca-certificates \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN npm init -y &&  \
    npm i puppeteer \
    # Add user so we don't need --no-sandbox.
    # same layer as npm install to keep re-chowned files from using up several hundred MBs more space
    && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /node_modules \
    && chown -R pptruser:pptruser /package.json \
    && chown -R pptruser:pptruser /package-lock.json

USER pptruser
CMD ["google-chrome-stable"]

USER su
WORKDIR /app
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
