# 工具和资源

## 规范编写工具

### 1. OpenAPI (Swagger)

**描述**：最流行的 API 规范格式

**官网**：https://swagger.io/specification/

**特点**：
- 标准化格式
- 丰富的工具生态
- 广泛支持

**使用**：

```yaml
# 编写 OpenAPI 规范
openapi: 3.0.0
info:
  title: My API
  version: 1.0.0
paths:
  /users:
    get:
      # ...
```

### 2. Stoplight Studio

**描述**：可视化 API 设计工具

**官网**：https://stoplight.io/studio

**特点**：
- 可视化编辑
- 实时预览
- 团队协作

### 3. Swagger Editor

**描述**：在线 OpenAPI 编辑器

**官网**：https://editor.swagger.io/

**特点**：
- 在线编辑
- 实时验证
- 自动生成文档

## Mock 服务工具

### 1. Prism

**描述**：基于 OpenAPI 的 Mock 服务器

**官网**：https://stoplight.io/open-source/prism

**安装**：

```bash
npm install -g @stoplight/prism-cli
```

**使用**：

```bash
# 启动 Mock 服务
prism mock api-spec.yaml

# 指定端口
prism mock api-spec.yaml -p 4010
```

### 2. Mockoon

**描述**：桌面应用 Mock 服务器

**官网**：https://mockoon.com/

**特点**：
- 图形界面
- 易于使用
- 支持多种格式

### 3. JSON Server

**描述**：快速创建 REST API

**官网**：https://github.com/typicode/json-server

**安装**：

```bash
npm install -g json-server
```

**使用**：

```bash
# 创建 db.json
{
  "users": [
    { "id": 1, "name": "John" }
  ]
}

# 启动服务
json-server --watch db.json
```

## 契约测试工具

### 1. Dredd

**描述**：基于 OpenAPI 的契约测试工具

**官网**：https://dredd.org/

**安装**：

```bash
npm install -g dredd
```

**使用**：

```bash
# 运行契约测试
dredd api-spec.yaml http://localhost:3000

# 使用配置文件
dredd --config dredd.yml
```

**配置文件**：

```yaml
# dredd.yml
dry-run: false
language: nodejs
server: npm start
server-wait: 3
init: false
custom:
  apiUrl: http://localhost:3000
```

### 2. Pact

**描述**：消费者驱动的契约测试

**官网**：https://pact.io/

**安装**：

```bash
npm install --save-dev @pact-foundation/pact
```

**使用**：

```javascript
const { Pact } = require('@pact-foundation/pact');

const provider = new Pact({
  consumer: 'Frontend',
  provider: 'Backend',
  port: 1234
});
```

### 3. Schemathesis

**描述**：基于属性的 API 测试

**官网**：https://schemathesis.readthedocs.io/

**特点**：
- 自动生成测试用例
- 发现边界情况
- 支持多种规范格式

## 文档生成工具

### 1. Swagger UI

**描述**：交互式 API 文档

**官网**：https://swagger.io/tools/swagger-ui/

**使用**：

```bash
npm install swagger-ui-express

# 在 Express 中使用
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./api-spec.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

### 2. ReDoc

**描述**：美观的 API 文档

**官网**：https://redocly.com/docs/redoc/

**特点**：
- 三栏布局
- 响应式设计
- 支持 OpenAPI 3.0

### 3. Stoplight Elements

**描述**：现代化的 API 文档组件

**官网**：https://stoplight.io/open-source/elements

**特点**：
- 可嵌入组件
- 交互式文档
- 代码示例

## 规范验证工具

### 1. Spectral

**描述**：OpenAPI 规范验证工具

**官网**：https://stoplight.io/open-source/spectral

**安装**：

```bash
npm install -g @stoplight/spectral-cli
```

**使用**：

```bash
# 验证规范
spectral lint api-spec.yaml

# 使用自定义规则
spectral lint api-spec.yaml --ruleset custom-ruleset.js
```

### 2. Swagger Parser

**描述**：解析和验证 OpenAPI 规范

**官网**：https://github.com/APIDevTools/swagger-parser

**使用**：

```javascript
const SwaggerParser = require('swagger-parser');

SwaggerParser.validate('api-spec.yaml')
  .then(api => {
    console.log('Valid OpenAPI spec');
  })
  .catch(err => {
    console.error('Invalid spec:', err);
  });
```

## 代码生成工具

### 1. OpenAPI Generator

**描述**：从 OpenAPI 规范生成代码

**官网**：https://openapi-generator.tech/

**安装**：

```bash
npm install -g @openapitools/openapi-generator-cli
```

**使用**：

```bash
# 生成客户端代码
openapi-generator generate -i api-spec.yaml -g typescript-axios -o ./client

# 生成服务器代码
openapi-generator generate -i api-spec.yaml -g nodejs-express-server -o ./server
```

### 2. Swagger Codegen

**描述**：从 Swagger 规范生成代码

**官网**：https://swagger.io/tools/swagger-codegen/

**使用**：

```bash
# 生成客户端
swagger-codegen generate -i api-spec.yaml -l typescript-axios -o ./client
```

## 测试工具

### 1. Postman

**描述**：API 测试工具

**官网**：https://www.postman.com/

**特点**：
- 图形界面
- 支持集合
- 自动化测试

### 2. Insomnia

**描述**：API 客户端

**官网**：https://insomnia.rest/

**特点**：
- 简洁界面
- 支持 GraphQL
- 插件系统

### 3. REST Client (VS Code)

**描述**：VS Code 扩展

**特点**：
- 在编辑器中测试
- 支持变量
- 支持认证

**使用**：

```http
### Get users
GET http://localhost:3000/api/v1/users

### Create user
POST http://localhost:3000/api/v1/users
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

## 规范管理平台

### 1. Stoplight

**描述**：API 设计和协作平台

**官网**：https://stoplight.io/

**特点**：
- 可视化设计
- 团队协作
- 版本管理

### 2. SwaggerHub

**描述**：API 设计和文档平台

**官网**：https://swagger.io/tools/swaggerhub/

**特点**：
- 集中管理
- 团队协作
- 自动生成文档

### 3. Redocly

**描述**：API 文档和规范管理

**官网**：https://redocly.com/

**特点**：
- 文档生成
- 规范验证
- CI/CD 集成

## 推荐工具组合

### 小型项目

- **规范编写**：Swagger Editor
- **Mock 服务**：Prism
- **文档生成**：Swagger UI
- **测试**：Postman

### 中型项目

- **规范编写**：Stoplight Studio
- **Mock 服务**：Prism
- **契约测试**：Dredd
- **文档生成**：ReDoc
- **规范管理**：GitHub

### 大型项目

- **规范编写**：Stoplight
- **Mock 服务**：Prism
- **契约测试**：Pact
- **文档生成**：Stoplight Elements
- **规范管理**：Stoplight / SwaggerHub
- **CI/CD**：GitHub Actions / GitLab CI

## 学习资源

### 官方文档

- **OpenAPI Specification**：https://swagger.io/specification/
- **Spec-Driven Development**：https://github.com/github/spec-kit

### 教程和文章

- **OpenAPI Guide**：https://swagger.io/docs/
- **API Design Best Practices**：https://restfulapi.net/

### 社区

- **OpenAPI GitHub**：https://github.com/OAI/OpenAPI-Specification
- **Stoplight Community**：https://community.stoplight.io/

## 总结

选择合适的工具可以大大提高 SDD 的效率：

1. **规范编写** - 选择易用的编辑器
2. **Mock 服务** - 快速生成 Mock
3. **契约测试** - 验证实现符合规范
4. **文档生成** - 自动生成文档
5. **规范管理** - 集中管理规范

根据项目规模选择合适的工具组合，逐步建立完善的 SDD 工作流。

