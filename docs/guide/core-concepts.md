# SDD 核心概念

## 规范（Specification）

### 定义

**规范（Specification）** 是对系统行为的明确定义，描述了系统应该做什么、如何做，以及在不同情况下的行为。

### 规范的层次

#### 1. 功能规范（Functional Specification）

描述系统应该实现什么功能：

```yaml
Feature: User Registration
Description: Allow users to create an account
Requirements:
  - User can register with email and password
  - System validates email format
  - System validates password strength
  - System sends verification email
```

#### 2. API 规范（API Specification）

描述 API 的接口定义：

```yaml
API: POST /api/users
Description: Create a new user
Request:
  method: POST
  path: /api/users
  headers:
    Content-Type: application/json
  body:
    email: string (required, email format)
    password: string (required, min 8 chars)
    name: string (optional, max 50 chars)
Response:
  Success (201):
    body:
      id: number
      email: string
      name: string
      createdAt: string (ISO8601)
  Error (400):
    body:
      message: string
      errors: array
```

#### 3. 数据规范（Data Specification）

描述数据结构：

```yaml
Schema: User
Properties:
  id:
    type: number
    description: Unique user identifier
  email:
    type: string
    format: email
    required: true
  name:
    type: string
    maxLength: 50
  createdAt:
    type: string
    format: date-time
```

### 规范的特性

1. **完整性** - 覆盖所有功能和边界情况
2. **清晰性** - 易于理解和实现
3. **可测试性** - 可以转化为测试用例
4. **可维护性** - 易于更新和版本管理

## 规范驱动（Spec-Driven）

### 定义

**规范驱动** 意味着规范是开发的起点和依据：

1. **规范优先** - 先写规范，再写代码
2. **规范验证** - 实现必须符合规范
3. **规范更新** - 规范变更驱动实现变更

### 规范驱动的流程

```
需求 → 规范编写 → 规范评审 → 实现开发 → 规范验证 → 发布
```

### 规范驱动的工具

- **规范编辑器** - 编写和编辑规范
- **规范验证器** - 验证规范的正确性
- **Mock 生成器** - 从规范生成 Mock 服务
- **测试生成器** - 从规范生成测试用例
- **文档生成器** - 从规范生成文档

## 契约（Contract）

### 定义

**契约（Contract）** 是规范在团队协作中的角色，定义了：

- **提供方** - 必须实现什么
- **消费方** - 可以期望什么
- **变更规则** - 如何管理变更

### 契约的类型

#### 1. API 契约

前后端之间的契约：

```yaml
Contract: User API
Provider: Backend Team
Consumers: Frontend Team, Mobile Team
Version: v1.0
Breaking Changes: Requires 2 weeks notice
```

#### 2. 服务契约

微服务之间的契约：

```yaml
Contract: User Service API
Provider: User Service
Consumers: Order Service, Payment Service
Version: v1.2
Deprecation: v1.0 (ends 2024-12-31)
```

### 契约的维护

1. **版本管理** - 规范版本化
2. **变更通知** - 变更提前通知
3. **兼容性** - 保持向后兼容
4. **废弃策略** - 明确的废弃流程

## 规范即文档（Spec as Documentation）

### 定义

**规范即文档** 意味着规范本身就是系统的最佳文档，无需单独维护文档。

### 优势

1. **自动同步** - 规范更新，文档自动更新
2. **准确性** - 规范即文档，不会过时
3. **可执行** - 规范可以生成代码和测试
4. **版本化** - 规范版本化，文档版本化

### 文档生成

从规范可以生成：

- **API 文档** - 可交互的 API 文档
- **使用示例** - 代码示例
- **测试用例** - 测试代码
- **架构图** - 系统架构图

## 规范即测试（Spec as Test）

### 定义

**规范即测试** 意味着规范可以直接转化为测试用例。

### 测试生成

```yaml
# 规范
API: GET /users/{id}
Response: 200 OK with user object
Error: 404 Not Found if user not found

# 自动生成测试
describe('GET /users/{id}', () => {
  it('returns 200 with user object', async () => {
    const response = await request.get('/users/1');
    expect(response.status).toBe(200);
    expect(response.body).toMatchSchema(userSchema);
  });

  it('returns 404 if user not found', async () => {
    const response = await request.get('/users/999');
    expect(response.status).toBe(404);
  });
});
```

### 测试类型

1. **单元测试** - 验证单个功能
2. **集成测试** - 验证系统集成
3. **契约测试** - 验证契约符合性
4. **端到端测试** - 验证完整流程

## 规范版本化（Spec Versioning）

### 定义

**规范版本化** 是管理规范变更的方法，类似于代码版本控制。

### 版本策略

#### 1. 语义化版本

```
v1.0.0 - 初始版本
v1.1.0 - 新增功能（向后兼容）
v2.0.0 - 重大变更（不兼容）
```

#### 2. 版本标识

```yaml
API: GET /users/{id}
Version: v1.2.0
Deprecated: false
Deprecation Date: null
```

### 版本管理

1. **版本控制** - 使用 Git 管理规范版本
2. **变更日志** - 记录每个版本的变更
3. **兼容性** - 明确版本兼容性
4. **迁移指南** - 提供版本迁移指南

## 规范评审（Spec Review）

### 定义

**规范评审** 是在实现之前对规范进行审查，确保规范的完整性和正确性。

### 评审内容

1. **完整性** - 是否覆盖所有需求
2. **正确性** - 逻辑是否正确
3. **清晰性** - 是否易于理解
4. **可测试性** - 是否可以测试
5. **可维护性** - 是否易于维护

### 评审流程

```
规范编写 → 自审 → 团队评审 → 修改 → 批准 → 实现
```

### 评审检查清单

- [ ] 功能需求是否完整
- [ ] 边界条件是否考虑
- [ ] 错误处理是否定义
- [ ] 数据结构是否清晰
- [ ] API 设计是否合理
- [ ] 性能要求是否明确
- [ ] 安全要求是否考虑

## 总结

SDD 的核心概念包括：

1. **规范** - 系统行为的明确定义
2. **规范驱动** - 以规范为中心的开发方法
3. **契约** - 团队协作的约定
4. **规范即文档** - 规范本身就是文档
5. **规范即测试** - 规范可以转化为测试
6. **规范版本化** - 管理规范变更
7. **规范评审** - 确保规范质量

理解这些核心概念是掌握 SDD 的基础。在下一节中，我们将学习[最佳实践](./best-practices/)。

