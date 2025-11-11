# 实现开发最佳实践

## 引言

基于规范进行实现开发是 SDD 的核心环节。本章将介绍如何基于规范进行高效的实现开发。

## 开发流程

### 1. 规范理解

在开始编码之前，深入理解规范：

```yaml
理解步骤：
  1. 阅读规范全文
  2. 理解功能需求
  3. 理解业务规则
  4. 理解边界条件
  5. 理解安全要求
  6. 理解性能要求
  7. 提出问题和澄清
```

### 2. 技术设计

基于规范进行技术设计：

```yaml
设计内容：
  - 数据库设计
  - API 路由设计
  - 业务逻辑设计
  - 错误处理设计
  - 安全实现设计
  - 性能优化设计
```

### 3. 实现开发

按照规范实现功能：

```yaml
实现原则：
  - 严格遵循规范
  - 实现所有定义的功能
  - 处理所有边界情况
  - 满足性能要求
  - 满足安全要求
```

### 4. 规范验证

验证实现是否符合规范：

```yaml
验证内容：
  - 请求处理正确
  - 响应格式正确
  - 状态码正确
  - 错误处理正确
  - 边界情况处理
```

## 实现策略

### 1. 自顶向下实现

从 API 接口开始，逐步实现：

```javascript
// 1. 定义路由
app.post('/api/v1/users', createUser);

// 2. 实现控制器
async function createUser(req, res) {
  try {
    // 3. 验证输入
    const { email, password, name } = validateInput(req.body);
    
    // 4. 业务逻辑
    const user = await userService.createUser({ email, password, name });
    
    // 5. 返回响应
    res.status(201).json(user);
  } catch (error) {
    // 6. 错误处理
    handleError(error, res);
  }
}
```

### 2. 测试驱动开发（TDD）

基于规范编写测试，然后实现：

```javascript
// 1. 编写测试（基于规范）
describe('POST /api/v1/users', () => {
  it('should create user with valid data', async () => {
    const response = await request
      .post('/api/v1/users')
      .send({
        email: 'user@example.com',
        password: 'SecurePass123',
        name: 'John Doe'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toMatchSchema(userSchema);
  });
  
  it('should return 400 for invalid email', async () => {
    const response = await request
      .post('/api/v1/users')
      .send({
        email: 'invalid-email',
        password: 'SecurePass123'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.errors).toContainEqual({
      field: 'email',
      message: 'Invalid email format'
    });
  });
});

// 2. 运行测试（失败）
// 3. 实现功能
// 4. 运行测试（通过）
```

### 3. 契约测试

使用契约测试确保实现符合规范：

```javascript
// 使用 Dredd 进行契约测试
const dredd = require('dredd');

const config = {
  server: 'http://localhost:3000',
  options: {
    path: ['./api-spec.yaml'],
    dry-run: false,
    silent: false
  }
};

dredd(config, (err, stats) => {
  if (err) {
    console.error('Contract test failed:', err);
    process.exit(1);
  }
  console.log('Contract test passed');
});
```

## 实现技巧

### 1. 输入验证

严格验证输入，符合规范要求：

```javascript
// 使用 Joi 进行验证
const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .required(),
  name: Joi.string().min(1).max(50).optional()
});

function validateInput(data) {
  const { error, value } = userSchema.validate(data);
  if (error) {
    throw new ValidationError(error.details);
  }
  return value;
}
```

### 2. 错误处理

按照规范处理错误：

```javascript
// 错误处理中间件
function handleError(error, res) {
  if (error instanceof ValidationError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  if (error instanceof DuplicateEmailError) {
    return res.status(409).json({
      message: 'Email already registered',
      code: 'EMAIL_EXISTS'
    });
  }
  
  // 其他错误
  console.error('Unexpected error:', error);
  return res.status(500).json({
    message: 'Internal server error',
    code: 'INTERNAL_ERROR'
  });
}
```

### 3. 响应格式化

确保响应格式符合规范：

```javascript
// 响应格式化
function formatUserResponse(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString()
  };
}

// 使用
res.status(201).json(formatUserResponse(user));
```

### 4. 边界情况处理

处理所有边界情况：

```javascript
async function getUserById(id) {
  // 验证 ID 格式
  const userId = parseInt(id);
  if (isNaN(userId) || userId < 1 || userId > 2147483647) {
    throw new ValidationError('Invalid user ID');
  }
  
  // 查询用户
  const user = await db.users.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  return user;
}
```

## 规范变更处理

### 1. 规范版本管理

支持多个规范版本：

```javascript
// 版本路由
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);

// 版本实现
const v1Routes = require('./routes/v1');
const v2Routes = require('./routes/v2');
```

### 2. 向后兼容

保持向后兼容：

```javascript
// v1 API
app.get('/api/v1/users/:id', getUserV1);

// v2 API（新功能）
app.get('/api/v2/users/:id', getUserV2);

// v1 实现保持不变
function getUserV1(req, res) {
  // 原有实现
}

// v2 实现（扩展）
function getUserV2(req, res) {
  // 新实现，但保持兼容
}
```

### 3. 废弃处理

处理废弃的 API：

```javascript
// 废弃的 API
app.get('/api/v1/old-endpoint', (req, res) => {
  res.set('Deprecation', 'true');
  res.set('Sunset', '2024-12-31');
  res.status(200).json({
    message: 'This endpoint is deprecated',
    migration: '/api/v2/new-endpoint'
  });
});
```

## 性能优化

### 1. 数据库优化

优化数据库查询：

```javascript
// 使用索引
// 规范要求：查询用户，响应时间 < 200ms

// 优化前
const user = await db.users.findOne({ email });

// 优化后（使用索引）
const user = await db.users.findOne({ email }).hint({ email: 1 });
```

### 2. 缓存策略

使用缓存提高性能：

```javascript
// 缓存用户数据
const cache = require('redis');

async function getUserById(id) {
  // 先查缓存
  const cached = await cache.get(`user:${id}`);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // 查数据库
  const user = await db.users.findById(id);
  
  // 写入缓存
  await cache.setex(`user:${id}`, 3600, JSON.stringify(user));
  
  return user;
}
```

### 3. 异步处理

使用异步处理提高响应速度：

```javascript
// 异步发送邮件
async function createUser(userData) {
  // 创建用户
  const user = await db.users.create(userData);
  
  // 异步发送验证邮件（不阻塞响应）
  emailService.sendVerificationEmail(user.email).catch(err => {
    console.error('Failed to send email:', err);
  });
  
  return user;
}
```

## 安全实现

### 1. 输入验证

严格验证所有输入：

```javascript
// 使用验证库
const validator = require('validator');

function validateEmail(email) {
  if (!validator.isEmail(email)) {
    throw new ValidationError('Invalid email format');
  }
  return validator.normalizeEmail(email);
}
```

### 2. SQL 注入防护

使用参数化查询：

```javascript
// 错误：SQL 注入风险
const query = `SELECT * FROM users WHERE email = '${email}'`;

// 正确：参数化查询
const query = 'SELECT * FROM users WHERE email = ?';
const user = await db.query(query, [email]);
```

### 3. XSS 防护

转义输出：

```javascript
// 使用转义库
const escape = require('escape-html');

function formatUserResponse(user) {
  return {
    id: user.id,
    email: user.email,
    name: escape(user.name), // 转义 HTML
    createdAt: user.createdAt.toISOString()
  };
}
```

### 4. 密码安全

安全处理密码：

```javascript
// 使用 bcrypt 哈希密码
const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
```

## 测试策略

### 1. 单元测试

测试单个功能：

```javascript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', async () => {
      const userData = {
        email: 'user@example.com',
        password: 'SecurePass123',
        name: 'John Doe'
      };
      
      const user = await userService.createUser(userData);
      
      expect(user).toMatchSchema(userSchema);
      expect(user.email).toBe(userData.email);
    });
  });
});
```

### 2. 集成测试

测试 API 端点：

```javascript
describe('POST /api/v1/users', () => {
  it('should return 201 with user object', async () => {
    const response = await request
      .post('/api/v1/users')
      .send({
        email: 'user@example.com',
        password: 'SecurePass123',
        name: 'John Doe'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toMatchSchema(userSchema);
  });
});
```

### 3. 契约测试

验证实现符合规范：

```javascript
// 使用 Dredd
const config = {
  server: 'http://localhost:3000',
  options: {
    path: ['./api-spec.yaml']
  }
};

dredd(config);
```

## 总结

实现开发的关键：

1. **理解规范** - 深入理解规范要求
2. **严格实现** - 严格按照规范实现
3. **全面测试** - 测试所有功能和边界情况
4. **持续验证** - 持续验证实现符合规范
5. **性能优化** - 满足性能要求
6. **安全实现** - 满足安全要求

在下一节中，我们将学习[测试策略](./testing.md)。

