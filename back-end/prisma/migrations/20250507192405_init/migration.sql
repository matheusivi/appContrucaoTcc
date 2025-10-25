-- CreateTable
CREATE TABLE "cotacoes" (
    "id" SERIAL NOT NULL,
    "produto_id" INTEGER NOT NULL,
    "fornecedor_id" INTEGER NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "data_cotacao" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "validade" DATE,

    CONSTRAINT "cotacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entradas" (
    "id" SERIAL NOT NULL,
    "produto_id" INTEGER NOT NULL,
    "fornecedor_id" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "preco_unitario" DECIMAL(10,2) NOT NULL,
    "data_entrada" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "usuario_id" INTEGER NOT NULL,
    "obra_id" INTEGER,
    "nota_fiscal" VARCHAR(50),

    CONSTRAINT "entradas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estoque_por_obra" (
    "id" SERIAL NOT NULL,
    "obra_id" INTEGER NOT NULL,
    "produto_id" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "estoque_por_obra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fases" (
    "id" SERIAL NOT NULL,
    "obra_id" INTEGER NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "data_inicio" DATE NOT NULL,
    "data_fim_prevista" DATE NOT NULL,
    "data_fim_real" DATE,
    "percentual_concluido" INTEGER DEFAULT 0,
    "peso" INTEGER DEFAULT 1,

    CONSTRAINT "fases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fornecedores" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "cnpj" VARCHAR(20) NOT NULL,
    "endereco" TEXT,
    "telefone" VARCHAR(20),
    "email" VARCHAR(100),
    "contato_principal" VARCHAR(100),

    CONSTRAINT "fornecedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historico_alteracoes" (
    "id" SERIAL NOT NULL,
    "tabela_alterada" VARCHAR(50) NOT NULL,
    "registro_id" INTEGER NOT NULL,
    "campo_alterado" VARCHAR(50) NOT NULL,
    "valor_antigo" TEXT,
    "valor_novo" TEXT,
    "usuario_id" INTEGER NOT NULL,
    "data_alteracao" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historico_alteracoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "obras" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "endereco" TEXT,
    "data_inicio" DATE NOT NULL,
    "data_fim_prevista" DATE NOT NULL,
    "responsavel_id" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ativa',
    "foto_url" VARCHAR(255),

    CONSTRAINT "obras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orcamento_por_obra" (
    "id" SERIAL NOT NULL,
    "obra_id" INTEGER NOT NULL,
    "valor_orcado" DECIMAL(12,2) NOT NULL,
    "data_criacao" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orcamento_por_obra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "descricao" TEXT,
    "unidade_medida" VARCHAR(20) NOT NULL,
    "quantidade_minima" INTEGER NOT NULL,
    "quantidade_atual" INTEGER NOT NULL DEFAULT 0,
    "preco_medio" DECIMAL(10,2) DEFAULT 0.00,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saidas" (
    "id" SERIAL NOT NULL,
    "produto_id" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "data_saida" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "obra_id" INTEGER,
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "saidas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transferencias" (
    "id" SERIAL NOT NULL,
    "produto_id" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "origem_obra_id" INTEGER,
    "destino_obra_id" INTEGER,
    "data_transferencia" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "transferencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "cargo" VARCHAR(50) NOT NULL,
    "nivel_acesso" VARCHAR(10) NOT NULL,
    "data_criacao" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "ultimo_login" TIMESTAMP(6),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "estoque_por_obra_obra_id_produto_id_key" ON "estoque_por_obra"("obra_id", "produto_id");

-- CreateIndex
CREATE UNIQUE INDEX "fornecedores_cnpj_key" ON "fornecedores"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "orcamento_por_obra_obra_id_key" ON "orcamento_por_obra"("obra_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "cotacoes" ADD CONSTRAINT "cotacoes_fornecedor_id_fkey" FOREIGN KEY ("fornecedor_id") REFERENCES "fornecedores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cotacoes" ADD CONSTRAINT "cotacoes_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "entradas" ADD CONSTRAINT "entradas_fornecedor_id_fkey" FOREIGN KEY ("fornecedor_id") REFERENCES "fornecedores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "entradas" ADD CONSTRAINT "entradas_obra_id_fkey" FOREIGN KEY ("obra_id") REFERENCES "obras"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "entradas" ADD CONSTRAINT "entradas_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "entradas" ADD CONSTRAINT "entradas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "estoque_por_obra" ADD CONSTRAINT "estoque_por_obra_obra_id_fkey" FOREIGN KEY ("obra_id") REFERENCES "obras"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "estoque_por_obra" ADD CONSTRAINT "estoque_por_obra_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fases" ADD CONSTRAINT "fases_obra_id_fkey" FOREIGN KEY ("obra_id") REFERENCES "obras"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "historico_alteracoes" ADD CONSTRAINT "historico_alteracoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "obras" ADD CONSTRAINT "obras_responsavel_id_fkey" FOREIGN KEY ("responsavel_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orcamento_por_obra" ADD CONSTRAINT "orcamento_por_obra_obra_id_fkey" FOREIGN KEY ("obra_id") REFERENCES "obras"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "saidas" ADD CONSTRAINT "saidas_obra_id_fkey" FOREIGN KEY ("obra_id") REFERENCES "obras"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "saidas" ADD CONSTRAINT "saidas_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "saidas" ADD CONSTRAINT "saidas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transferencias" ADD CONSTRAINT "transferencias_destino_obra_id_fkey" FOREIGN KEY ("destino_obra_id") REFERENCES "obras"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transferencias" ADD CONSTRAINT "transferencias_origem_obra_id_fkey" FOREIGN KEY ("origem_obra_id") REFERENCES "obras"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transferencias" ADD CONSTRAINT "transferencias_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transferencias" ADD CONSTRAINT "transferencias_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
