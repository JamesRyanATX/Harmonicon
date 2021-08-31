FROM node:10.13-alpine as builder

WORKDIR /harmonicon
ENV NODE_ENV=production

# Setup
# -----

COPY package.json /harmonicon
COPY package-lock.json /harmonicon
COPY lerna.json /harmonicon

COPY packages/cli/package.json /harmonicon/packages/cli/
COPY packages/cli/package-lock.json /harmonicon/packages/cli/
COPY packages/compose/package.json /harmonicon/packages/compose/
COPY packages/compose/package-lock.json /harmonicon/packages/compose/
COPY packages/core/package.json /harmonicon/packages/core/
COPY packages/core/package-lock.json /harmonicon/packages/core/
COPY packages/driver/package.json /harmonicon/packages/driver/
COPY packages/driver/package-lock.json /harmonicon/packages/driver/
COPY packages/driver-audio-mock/package.json /harmonicon/packages/driver-audio-mock/
COPY packages/driver-audio-mock/package-lock.json /harmonicon/packages/driver-audio-mock/
COPY packages/driver-audio-tone/package.json /harmonicon/packages/driver-audio-tone/
COPY packages/driver-audio-tone/package-lock.json /harmonicon/packages/driver-audio-tone/
COPY packages/driver-storage-localstorage/package.json /harmonicon/packages/driver-storage-localstorage/
COPY packages/driver-storage-localstorage/package-lock.json /harmonicon/packages/driver-storage-localstorage/
COPY packages/driver-storage-mock/package.json /harmonicon/packages/driver-storage-mock/
COPY packages/driver-storage-mock/package-lock.json /harmonicon/packages/driver-storage-mock/
COPY packages/examples/package.json /harmonicon/packages/examples/
COPY packages/examples/package-lock.json /harmonicon/packages/examples/
COPY packages/library-core/package.json /harmonicon/packages/library-core/
COPY packages/library-core/package-lock.json /harmonicon/packages/library-core/
COPY packages/util/package.json /harmonicon/packages/util/
COPY packages/util/package-lock.json /harmonicon/packages/util/
COPY packages/web/package.json /harmonicon/packages/web/
COPY packages/web/package-lock.json /harmonicon/packages/web/

RUN npm ci --ignore-scripts --production --no-optional
RUN npx lerna bootstrap --hoist --ignore-scripts -- --production --no-optional


# Build
# -----

COPY . /harmonicon/
RUN cd packages/web && \
    npm run export && \
    mkdir -p /harmonicon/packages/web/out/librares/core/instruments && \
    mv /harmonicon/packages/library-core/samples/* /harmonicon/packages/web/out/librares/core/instruments


# Serve
# -----

FROM nginx:1.15-alpine
COPY --from=builder /harmonicon/packages/web/out /usr/share/nginx/html
