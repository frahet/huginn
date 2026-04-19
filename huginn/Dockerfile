FROM oven/bun:1
WORKDIR /app
COPY gbrain ./gbrain
COPY huginn ./huginn
WORKDIR /app/huginn
RUN bun install
CMD ["bun", "run", "src/index.ts"]
