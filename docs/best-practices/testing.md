# 测试策略最佳实践

## 引言

测试是确保实现符合规范的关键。本章将介绍如何基于规范建立完善的测试策略。

## 测试金字塔

```
        /\
       /  \      E2E Tests (少量)
      /----\
     /      \    Integration Tests (适量)
    /--------\
   /          \  Unit Tests (大量)
  /------------\
```

### 1. 单元测试（Unit Tests）

**目的**：测试单个函数或方法

**特点**：
- 数量最多
- 运行最快
- 隔离测试

**示例**：

```javascript
describe('validateEmail', () => {
  it('should return true for valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });
  
  it('should return false for invalid email', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });
});
```

### 2. 集成测试（Integration Tests）

**目的**：测试多个组件的协作

**特点**：
- 数量适中
- 运行较快
- 测试组件交互

**示例**：

```javascript
describe('UserService Integration', () => {
  it('should create user and send email', async () => {
    const user = await userService.createUser({
      email: 'user@example.com',
      password: 'SecurePass123'
    });
    
    expect(user).toBeDefined();
    expect(emailService.sendEmail).toHaveBeenCalled();
  });
});
```

### 3. 端到端测试（E2E Tests）

**目的**：测试完整流程

**特点**：
- 数量最少
- 运行较慢
- 测试真实场景

**示例**：

```javascript
describe('User Registration E2E', () => {
  it('should register user end-to-end', async () => {
    // 1. 注册用户
    const response = await request
      .post('/api/v1/users')
      .send({
        email: 'user@example.com',
        password: 'SecurePass123',
        name: 'John Doe'
      });
    
    expect(response.status).toBe(201);
    
    // 2. 验证用户创建
    const user = await db.users.findOne({ email: 'user@example.com' });
    expect(user).toBeDefined();
    
    // 3. 验证邮件发送
    expect(emailService.sentEmails).toContainEqual({
      to: 'user@example.com',
      subject: 'Verify your email'
    });
  });
});
```

## 基于规范的测试

### 1. 规范即测试用例

规范可以直接转化为测试用例：

```yaml
# 规范
API: POST /api/v1/users
Request:
  email: string (required, email format)
  password: string (required, min 8 chars)
Response:
  Success (201): user object
  Error (400): validation errors
```

```javascript
// 自动生成的测试
describe('POST /api/v1/users', () => {
  describe('Success Cases', () => {
    it('should return 201 with user object', async () => {
      const response = await request
        .post('/api/v1/users')
        .send({
          email: 'user@example.com',
          password: 'SecurePass123'
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toMatchSchema(userSchema);
    });
  });
  
  describe('Error Cases', () => {
    it('should return 400 for invalid email', async () => {
      const response = await request
        .post('/api/v1/users')
        .send({
          email: 'invalid-email',
          password: 'SecurePass123'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
    
    it('should return 400 for short password', async () => {
      const response = await request
        .post('/api/v1/users')
        .send({
          email: 'user@example.com',
          password: 'short'
        });
      
      expect(response.status).toBe(400);
    });
  });
});
```

### 2. 边界条件测试

测试所有边界情况：

```yaml
# 规范中的边界条件
Edge Cases:
  - Empty email: 400 Bad Request
  - Invalid email format: 400 Bad Request
  - Email too long: 400 Bad Request
  - Password too short: 400 Bad Request
  - Password too long: 400 Bad Request
  - Duplicate email: 409 Conflict
```

```javascript
describe('POST /api/v1/users - Edge Cases', () => {
  it('should return 400 for empty email', async () => {
    const response = await request
      .post('/api/v1/users')
      .send({ password: 'SecurePass123' });
    
    expect(response.status).toBe(400);
  });
  
  it('should return 400 for email too long', async () => {
    const longEmail = 'a'.repeat(250) + '@example.com';
    const response = await request
      .post('/api/v1/users')
      .send({
        email: longEmail,
        password: 'SecurePass123'
      });
    
    expect(response.status).toBe(400);
  });
  
  it('should return 409 for duplicate email', async () => {
    // 先创建用户
    await request.post('/api/v1/users').send({
      email: 'user@example.com',
      password: 'SecurePass123'
    });
    
    // 再次创建相同邮箱
    const response = await request
      .post('/api/v1/users')
      .send({
        email: 'user@example.com',
        password: 'SecurePass123'
      });
    
    expect(response.status).toBe(409);
  });
});
```

### 3. 响应格式测试

验证响应格式符合规范：

```javascript
describe('Response Format', () => {
  it('should match success response schema', async () => {
    const response = await request
      .post('/api/v1/users')
      .send({
        email: 'user@example.com',
        password: 'SecurePass123'
      });
    
    expect(response.body).toMatchSchema({
      type: 'object',
      required: ['id', 'email', 'createdAt'],
      properties: {
        id: { type: 'number' },
        email: { type: 'string', format: 'email' },
        name: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' }
      }
    });
  });
  
  it('should match error response schema', async () => {
    const response = await request
      .post('/api/v1/users')
      .send({ email: 'invalid' });
    
    expect(response.body).toMatchSchema({
      type: 'object',
      required: ['message', 'errors'],
      properties: {
        message: { type: 'string' },
        errors: {
          type: 'array',
          items: {
            type: 'object',
            required: ['field', 'message'],
            properties: {
              field: { type: 'string' },
              message: { type: 'string' }
            }
          }
        }
      }
    });
  });
});
```

## 契约测试

### 1. 什么是契约测试

契约测试验证实现是否符合规范（契约）。

### 2. 使用 Dredd

Dredd 是一个契约测试工具：

```bash
# 安装
npm install -g dredd

# 运行测试
dredd api-spec.yaml http://localhost:3000
```

```yaml
# api-spec.yaml
openapi: 3.0.0
paths:
  /api/v1/users:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required: [email, password]
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
                  minLength: 8
      responses:
        '201':
          description: User created
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: number
                  email:
                    type: string
```

### 3. CI/CD 集成

在 CI/CD 中运行契约测试：

```yaml
# .github/workflows/contract-test.yml
name: Contract Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm start &
      - run: npm install -g dredd
      - run: dredd api-spec.yaml http://localhost:3000
```

## 测试工具

### 1. 测试框架

#### Jest

```javascript
// 安装
npm install --save-dev jest

// 测试文件
describe('UserService', () => {
  it('should create user', async () => {
    const user = await userService.createUser({
      email: 'user@example.com',
      password: 'SecurePass123'
    });
    
    expect(user).toBeDefined();
  });
});
```

#### Mocha + Chai

```javascript
// 安装
npm install --save-dev mocha chai

// 测试文件
const { expect } = require('chai');

describe('UserService', () => {
  it('should create user', async () => {
    const user = await userService.createUser({
      email: 'user@example.com',
      password: 'SecurePass123'
    });
    
    expect(user).to.exist;
  });
});
```

### 2. API 测试

#### Supertest

```javascript
// 安装
npm install --save-dev supertest

// 测试文件
const request = require('supertest');
const app = require('../app');

describe('POST /api/v1/users', () => {
  it('should create user', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        email: 'user@example.com',
        password: 'SecurePass123'
      });
    
    expect(response.status).toBe(201);
  });
});
```

### 3. 契约测试

#### Dredd

```bash
# 安装
npm install -g dredd

# 运行
dredd api-spec.yaml http://localhost:3000
```

#### Pact

```javascript
// 安装
npm install --save-dev @pact-foundation/pact

// 测试文件
const { Pact } = require('@pact-foundation/pact');

const provider = new Pact({
  consumer: 'Frontend',
  provider: 'Backend',
  port: 1234
});

describe('User API Contract', () => {
  beforeAll(() => provider.setup());
  afterAll(() => provider.finalize());
  
  it('should create user', async () => {
    await provider.addInteraction({
      state: 'user does not exist',
      uponReceiving: 'a request to create user',
      withRequest: {
        method: 'POST',
        path: '/api/v1/users',
        body: {
          email: 'user@example.com',
          password: 'SecurePass123'
        }
      },
      willRespondWith: {
        status: 201,
        body: {
          id: 1,
          email: 'user@example.com'
        }
      }
    });
  });
});
```

## 测试覆盖率

### 1. 覆盖率目标

设定合理的覆盖率目标：

- **单元测试**：80%+
- **集成测试**：60%+
- **E2E 测试**：关键流程 100%

### 2. 使用工具

#### Istanbul (nyc)

```bash
# 安装
npm install --save-dev nyc

# 运行测试并生成覆盖率
nyc npm test
```

#### Jest Coverage

```javascript
// jest.config.js
module.exports = {
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

## 测试最佳实践

### 1. 测试命名

使用清晰的测试命名：

```javascript
// 好的命名
describe('POST /api/v1/users', () => {
  it('should return 201 with user object when valid data provided', () => {
    // ...
  });
  
  it('should return 400 when email is invalid', () => {
    // ...
  });
});

// 不好的命名
describe('users', () => {
  it('test 1', () => {
    // ...
  });
});
```

### 2. 测试隔离

每个测试应该独立：

```javascript
// 好的做法：每个测试独立
describe('UserService', () => {
  beforeEach(() => {
    // 清理数据库
    db.users.deleteMany({});
  });
  
  it('should create user', async () => {
    // 不依赖其他测试
  });
});

// 不好的做法：测试之间依赖
describe('UserService', () => {
  let userId;
  
  it('should create user', async () => {
    const user = await userService.createUser({...});
    userId = user.id; // 其他测试依赖这个
  });
  
  it('should get user', async () => {
    const user = await userService.getUser(userId); // 依赖上面的测试
  });
});
```

### 3. 测试数据

使用测试数据工厂：

```javascript
// 测试数据工厂
function createUserData(overrides = {}) {
  return {
    email: 'user@example.com',
    password: 'SecurePass123',
    name: 'John Doe',
    ...overrides
  };
}

// 使用
it('should create user', async () => {
  const userData = createUserData({ email: 'test@example.com' });
  const user = await userService.createUser(userData);
  expect(user.email).toBe('test@example.com');
});
```

### 4. Mock 和 Stub

适当使用 Mock 和 Stub：

```javascript
// Mock 外部服务
jest.mock('../services/emailService', () => ({
  sendEmail: jest.fn()
}));

it('should send email after user creation', async () => {
  await userService.createUser({...});
  expect(emailService.sendEmail).toHaveBeenCalled();
});
```

## 总结

测试策略的关键：

1. **测试金字塔** - 单元测试为主，集成测试为辅，E2E 测试补充
2. **基于规范** - 测试用例来自规范
3. **契约测试** - 验证实现符合规范
4. **工具支持** - 使用合适的测试工具
5. **覆盖率** - 设定合理的覆盖率目标
6. **最佳实践** - 遵循测试最佳实践

测试是确保实现符合规范的关键，建立完善的测试策略是 SDD 成功的重要保障。

