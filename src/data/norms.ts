/**
 * AI Workload Estimation Norms & Data
 */

export type Role = 
  | 'PM' 
  | 'Architect' 
  | 'TL' 
  | 'DSLead' 
  | 'Development' 
  | 'Development Back' 
  | 'Development Front' 
  | 'DS/Ai/ML' 
  | 'DevOps' 
  | 'QA' 
  | 'Product' 
  | 'Analytics' 
  | 'Analytics System' 
  | 'Analytics Busines' 
  | 'Designer' 
  | 'LLM Architect';

export interface Constraint {
  id: string;
  label: string;
  adjustment: number;
}

export interface Task {
  id: string;
  category: string;
  title: string;
  description: string;
  baseHours: number;
  defaultRole: Role;
  resultImage: string;
  constraints?: Constraint[];
}

export const ROLE_LABELS: Record<Role, string> = {
  'TL': 'Техлид',
  'DSLead': 'Head of AI',
  'Development': 'Разработка',
  'Development Back': 'Бэкенд',
  'Development Front': 'Фронтенд',
  'DS/Ai/ML': 'DS Инженер',
  'DevOps': 'DevOps/SRE',
  'QA': 'Тестировщик',
  'PM': 'Менеджер проекта',
  'Product': 'Продукт овнер',
  'Analytics': 'Аналитик',
  'Analytics System': 'Системный аналитик',
  'Analytics Busines': 'Бизнес аналитик',
  'Architect': 'Архитектор',
  'Designer': 'Дизайнер',
  'LLM Architect': 'LLM Архитектор',
};

export const ROLE_COSTS: Record<Role, number> = {
  'TL': 6600,
  'DSLead': 6800,
  'Development': 5300,
  'Development Back': 5300,
  'Development Front': 5300,
  'DS/Ai/ML': 5800,
  'DevOps': 5500,
  'QA': 4000,
  'PM': 6600,
  'Product': 6600,
  'Analytics': 5300,
  'Analytics System': 5300,
  'Analytics Busines': 5300,
  'Architect': 7500,
  'Designer': 5300,
  'LLM Architect': 15000,
};

export const BASE_NORMS: Record<string, Task[]> = {
  'Infrastructure & DevOps': [
    { id: 'i_k8s', category: 'Infrastructure & DevOps', title: 'Настройка кластера k8s', description: 'Настройка Managed Kubernetes или on-prem кластера (до 8 нод)', baseHours: 16, defaultRole: 'DevOps', resultImage: 'K8s Cluster' },
    { id: 'i_ingress', category: 'Infrastructure & DevOps', title: 'Настройка Ingress', description: 'nginx/envoy gateway, сертификаты Let\'s Encrypt', baseHours: 4, defaultRole: 'DevOps', resultImage: 'Ingress logs' },
    { id: 'i_vault', category: 'Infrastructure & DevOps', title: 'Интеграция с секрет-хранилищем', description: 'HashiCorp Vault / Vault Agent', baseHours: 4, defaultRole: 'DevOps', resultImage: 'Secrets active' },
    { id: 'i_runner', category: 'Infrastructure & DevOps', title: 'Установка GitLab Runner', description: 'Настройка shell/docker раннеров', baseHours: 4, defaultRole: 'DevOps', resultImage: 'Runner active' },
    { id: 'i_vllm', category: 'Infrastructure & DevOps', title: 'Развертывание vLLM инференса', description: 'Запуск LLM модели в контейнере/K8s с GPU', baseHours: 5, defaultRole: 'DevOps', resultImage: 'Inference endpoint' },
    { id: 'i_sso', category: 'Infrastructure & DevOps', title: 'Подключение SSO (DEX/Keycloak)', description: 'Интеграция с корпоративным iDP', baseHours: 4, defaultRole: 'Development Back', resultImage: 'Login screen' },
    { id: 'i_qdrant', category: 'Infrastructure & DevOps', title: 'Развертывание Qdrant', description: 'Векторная БД (кластер или сингл)', baseHours: 4, defaultRole: 'DevOps', resultImage: 'Storage active' },
    { id: 'i_pg', category: 'Infrastructure & DevOps', title: 'Развертывание PostgreSQL', description: 'БД с настроенным резервным копированием', baseHours: 4, defaultRole: 'DevOps', resultImage: 'SQL Prompt' },
    { id: 'i_pg_backup', category: 'Infrastructure & DevOps', title: 'Резервное копирование PostgreSQL', description: 'Настройка WAL-G / Barman / S3', baseHours: 4, defaultRole: 'DevOps', resultImage: 'Backup logs' },
    { id: 'i_click', category: 'Infrastructure & DevOps', title: 'Развертывание Clickhouse', description: 'Кластер для OLAP/логов', baseHours: 6, defaultRole: 'DevOps', resultImage: 'CH Instance' },
    { id: 'i_redis', category: 'Infrastructure & DevOps', title: 'Развертывание Redis', description: 'Кэш и очереди', baseHours: 4, defaultRole: 'DevOps', resultImage: 'Redis ping' },
    { id: 'i_kafka', category: 'Infrastructure & DevOps', title: 'Развертывание Kafka', description: 'Брокер сообщений (базовая настройка)', baseHours: 8, defaultRole: 'DevOps', resultImage: 'Topics list' },
    { id: 'i_minio', category: 'Infrastructure & DevOps', title: 'Развертывание MinIO', description: 'S3-совместимое хранилище', baseHours: 4, defaultRole: 'DevOps', resultImage: 'MinIO UI' },
    { id: 'i_reg', category: 'Infrastructure & DevOps', title: 'Container Registry', description: 'Harbor / Nexus / Docker Registry', baseHours: 4, defaultRole: 'DevOps', resultImage: 'Registry UI' },
    { id: 'i_git', category: 'Infrastructure & DevOps', title: 'Развертывание GitLab', description: 'Сэлф-хостед инсталляция', baseHours: 8, defaultRole: 'DevOps', resultImage: 'GitLab Home' },
    { id: 'i_vpn', category: 'Infrastructure & DevOps', title: 'Настройка OpenVPN/Wireguard', description: 'Безопасный доступ к контуру', baseHours: 8, defaultRole: 'DevOps', resultImage: 'VPN Tunnel' },
    { id: 'i_ansible', category: 'Infrastructure & DevOps', title: 'Создание Ansible ролей', description: 'Конфигурация кластера сервисов', baseHours: 8, defaultRole: 'DevOps', resultImage: 'Playbook run' },
    { id: 'i_ci', category: 'Infrastructure & DevOps', title: 'CI Пайплайн (Tests/Lint)', description: 'Автоматизация проверок в GitLab', baseHours: 8, defaultRole: 'DevOps', resultImage: 'Pipeline view' },
    { id: 'i_cd', category: 'Infrastructure & DevOps', title: 'CD Пайплайн (Deploy)', description: 'Деплой в dev/prod окружения', baseHours: 8, defaultRole: 'DevOps', resultImage: 'Deploy job' },
    { id: 'i_sec_pipe', category: 'Infrastructure & DevOps', title: 'Security Пайплайн', description: 'SAST/DAST/Secret detection', baseHours: 8, defaultRole: 'DevOps', resultImage: 'Sec report' },
    { id: 'i_prom', category: 'Infrastructure & DevOps', title: 'Настройка Prometheus', description: 'Сбор метрик и экспортеры', baseHours: 6, defaultRole: 'DevOps', resultImage: 'Prometheus query' },
    { id: 'i_loki', category: 'Infrastructure & DevOps', title: 'Настройка Loki', description: 'Сбор и агрегация логов', baseHours: 8, defaultRole: 'DevOps', resultImage: 'Loki logs' },
    { id: 'i_tempo', category: 'Infrastructure & DevOps', title: 'Настройка Tempo', description: 'Распределенный трейсинг', baseHours: 8, defaultRole: 'DevOps', resultImage: 'Tempo trace' },
    { id: 'i_grafana', category: 'Infrastructure & DevOps', title: 'Настройка Grafana', description: 'Дашборды и алертинг', baseHours: 6, defaultRole: 'DevOps', resultImage: 'Grafana Dashboard' },
    { id: 'i_langfuse', category: 'Infrastructure & DevOps', title: 'Установка Langfuse', description: 'LLM observability (web + worker)', baseHours: 6, defaultRole: 'DevOps', resultImage: 'Langfuse UI' },
    { id: 'i_velero', category: 'Infrastructure & DevOps', title: 'Velero Backup', description: 'Бэкап K8s томов и ресурсов', baseHours: 4, defaultRole: 'DevOps', resultImage: 'Restore success' },
  ],
  'OCR Pipeline': [
    { id: 'ocr_1', category: 'OCR Pipeline', title: 'Анализ источников OCR', description: 'Оценка качества сканов и типов полей', baseHours: 12, defaultRole: 'DS/Ai/ML', resultImage: 'Data report' },
    { id: 'ocr_2', category: 'OCR Pipeline', title: 'Проектирование OCR пайплайна', description: 'Схема классификации и извлечения', baseHours: 16, defaultRole: 'Architect', resultImage: 'Arch Schema' },
    { id: 'ocr_3', category: 'OCR Pipeline', title: 'Настройка VLLM-OCR модели', description: 'Развертывание и оптимизация под задачу', baseHours: 24, defaultRole: 'DS/Ai/ML', resultImage: 'Model metrics' },
    { id: 'ocr_4', category: 'OCR Pipeline', title: 'Подготовка выборки OCR', description: 'Разметка и подготовка Eval-сета', baseHours: 24, defaultRole: 'QA', resultImage: 'Labeled set' },
    { id: 'ocr_5', category: 'OCR Pipeline', title: 'Постобработка OCR', description: 'Нормализация и структурирование данных', baseHours: 16, defaultRole: 'DS/Ai/ML', resultImage: 'JSON Output' },
    { id: 'ocr_6', category: 'OCR Pipeline', title: 'Интеграция OCR пайплайна', description: 'Подключение к RAG или целевым системам', baseHours: 16, defaultRole: 'Development Back', resultImage: 'API Integration' },
    { id: 'ocr_7', category: 'OCR Pipeline', title: 'Тестирование качества OCR', description: 'Метрики WER/CER и ручная проверка', baseHours: 16, defaultRole: 'QA', resultImage: 'QA Report' },
  ],
  'AI Agents & Logic': [
    { id: 'ag_1', category: 'AI Agents & Logic', title: 'Анализ сценариев агента', description: 'Маппинг шагов, ролей и вызовов', baseHours: 12, defaultRole: 'Analytics System', resultImage: 'Step matrix' },
    { id: 'ag_2', category: 'AI Agents & Logic', title: 'Проектирование планировщика', description: 'Логика выбора инструментов и ветвления', baseHours: 24, defaultRole: 'DS/Ai/ML', resultImage: 'Router config' },
    { id: 'ag_3', category: 'AI Agents & Logic', title: 'Реализация агента с API', description: 'Доступ к инструментам (HTTP, DB)', baseHours: 24, defaultRole: 'Development Back', resultImage: 'Connectors code' },
    { id: 'ag_4', category: 'AI Agents & Logic', title: 'Стратегии планирования', description: 'Настройка пересчета плана при ошибках', baseHours: 16, defaultRole: 'Development Back', resultImage: 'Error handler' },
    { id: 'ag_5', category: 'AI Agents & Logic', title: 'Тестирование сценариев', description: 'Покрытие edge-кейсов и автотесты', baseHours: 24, defaultRole: 'QA', resultImage: 'Test cases' },
    { id: 'ag_6', category: 'AI Agents & Logic', title: 'Мониторинг шагов агента', description: 'Трейсинг цепочек и отладка шагов', baseHours: 16, defaultRole: 'Development Back', resultImage: 'Traces UI' },
  ],
  'RAG Pipeline Full': [
    { id: 'rag_f0', category: 'RAG Pipeline Full', title: 'Анализ и проектирование RAG', description: 'Выбор стратегии чанкинга и ретривала', baseHours: 16, defaultRole: 'Architect', resultImage: 'Arch vision' },
    { id: 'rag_f1', category: 'RAG Pipeline Full', title: 'Сбор данных (Ingest)', description: 'Парсинг сайтов, PDF, доков', baseHours: 16, defaultRole: 'DS/Ai/ML', resultImage: 'Raw files' },
    { id: 'rag_f2', category: 'RAG Pipeline Full', title: 'Очистка и предобработка', description: 'Удаление "мусора", таблиц, картинок', baseHours: 24, defaultRole: 'DS/Ai/ML', resultImage: 'Clean dataset' },
    { id: 'rag_f3', category: 'RAG Pipeline Full', title: 'Разбиение на чанки', description: 'Семантическое разбиение с учетом структуры', baseHours: 8, defaultRole: 'DS/Ai/ML', resultImage: 'Chunks stats' },
    { id: 'rag_f4', category: 'RAG Pipeline Full', title: 'Векторизация (Embeddings)', description: 'Fine-tuning модели под домен', baseHours: 8, defaultRole: 'DS/Ai/ML', resultImage: 'Embedding space' },
    { id: 'rag_f5', category: 'RAG Pipeline Full', title: 'Загрузка в векторную БД', description: 'Индексация в Qdrant/Milvus', baseHours: 12, defaultRole: 'DS/Ai/ML', resultImage: 'DB Indexed' },
    { id: 'rag_f6', category: 'RAG Pipeline Full', title: 'Выбор и интеграция LLM', description: 'Подключение через API/vLLM', baseHours: 8, defaultRole: 'LLM Architect', resultImage: 'Model active' },
    { id: 'rag_f7', category: 'RAG Pipeline Full', title: 'Промпт-инжиниринг', description: 'Chain-of-thought, роли, мульти-тур', baseHours: 24, defaultRole: 'DS/Ai/ML', resultImage: 'System prompts' },
    { id: 'rag_f8', category: 'RAG Pipeline Full', title: 'Разработка логики RAG', description: 'Гибридный поиск, реранкинг', baseHours: 20, defaultRole: 'DS/Ai/ML', resultImage: 'Logic graph' },
    { id: 'rag_f9', category: 'RAG Pipeline Full', title: 'Создание API-endpoint', description: 'Эндпоинт чата с историей', baseHours: 8, defaultRole: 'Development Back', resultImage: 'API Response' },
    { id: 'rag_f10', category: 'RAG Pipeline Full', title: 'Создание UI Chat', description: 'Интерфейс с источниками и ОС', baseHours: 30, defaultRole: 'Development Front', resultImage: 'Chat Window' },
    { id: 'rag_f11', category: 'RAG Pipeline Full', title: 'Тестирование и оценка', description: 'RAGAS метрики, A/B тесты', baseHours: 24, defaultRole: 'QA', resultImage: 'Eval report' },
    { id: 'rag_f12', category: 'RAG Pipeline Full', title: 'Деплой и поддержка', description: 'CI/CD и мониторинг переиндексации', baseHours: 24, defaultRole: 'DevOps', resultImage: 'Service live' },
  ],
  'Channels & Cross-platform': [
    { id: 'cr_1', category: 'Channels & Cross-platform', title: 'Анализ каналов связи', description: 'Требования к web/mobile/express', baseHours: 12, defaultRole: 'Analytics', resultImage: 'Channel spec' },
    { id: 'cr_2', category: 'Channels & Cross-platform', title: 'Backend API под все каналы', description: 'Унифицированный чат-эндпоинт', baseHours: 16, defaultRole: 'Development Back', resultImage: 'Swagger' },
    { id: 'cr_3', category: 'Channels & Cross-platform', title: 'Адаптер для web-клиента', description: 'SPA интерфейс с состоянием сессии', baseHours: 24, defaultRole: 'Development Front', resultImage: 'Web view' },
    { id: 'cr_4', category: 'Channels & Cross-platform', title: 'Адаптер для мессенджера', description: 'Бот (Telegram/Teams/eXpress)', baseHours: 24, defaultRole: 'Development Back', resultImage: 'Bot UI' },
    { id: 'cr_5', category: 'Channels & Cross-platform', title: 'Синхронизация сессий', description: 'Общая история и контекст в каналах', baseHours: 16, defaultRole: 'Development Back', resultImage: 'History DB' },
    { id: 'cr_6', category: 'Channels & Cross-platform', title: 'Тестирование кроссплатформенности', description: 'Автотесты по всем каналам', baseHours: 16, defaultRole: 'QA', resultImage: 'QA Matrix' },
  ],
  'Foundation & Microservices': [
    { id: 'fm_repo', category: 'Foundation & Microservices', title: 'Создание каркаса репо', description: 'CI/CD, линтеры, структура (2 репо)', baseHours: 16, defaultRole: 'DevOps', resultImage: 'Repo structure' },
    { id: 'fm_auth', category: 'Foundation & Microservices', title: 'Настройка Auth/RBAC', description: 'Keycloak/ADFS интеграция', baseHours: 40, defaultRole: 'Development Back', resultImage: 'Auth flow' },
    { id: 'fm_micro', category: 'Foundation & Microservices', title: 'Структура микросервиса', description: 'Базовый шаблон для новых сервисов', baseHours: 16, defaultRole: 'Development Back', resultImage: 'Boilerplate' },
    { id: 'fm_adfs', category: 'Foundation & Microservices', title: 'Интеграция с ADFS', description: 'Проверка логина/пароля, валидация токена', baseHours: 40, defaultRole: 'Development Back', resultImage: 'ADFS Success' },
    { id: 'fm_proxy', category: 'Foundation & Microservices', title: 'Proxy API Gateway', description: 'Маршрутизация и инспекция токенов', baseHours: 16, defaultRole: 'Development Back', resultImage: 'API Hub' },
  ],
  'Messaging & Event Logic': [
    { id: 'msg_r_setup', category: 'Messaging & Event Logic', title: 'Настройка RabbitMQ брокера', description: 'Очереди, обменники, политики', baseHours: 6, defaultRole: 'DevOps', resultImage: 'MQ Admin' },
    { id: 'msg_r_conn', category: 'Messaging & Event Logic', title: 'Коннектор к RabbitMQ', description: 'Продюсер/Консьюмер в приложении', baseHours: 8, defaultRole: 'Development Back', resultImage: 'Connection logs' },
    { id: 'msg_k_setup', category: 'Messaging & Event Logic', title: 'Настройка Kafka кластера', description: 'Топики, партиции, ретеншн', baseHours: 16, defaultRole: 'DevOps', resultImage: 'Kafka center' },
    { id: 'msg_k_conn', category: 'Messaging & Event Logic', title: 'Kafka Producer/Consumer', description: 'Клиентский SDK и обработка ошибок', baseHours: 12, defaultRole: 'Development Back', resultImage: 'Offset data' },
    { id: 'msg_logic', category: 'Messaging & Event Logic', title: 'Логика обработки событий', description: 'Бизнес-правила на 1 тип события', baseHours: 16, defaultRole: 'Development Back', resultImage: 'Logic code' },
  ],
  'Monitoring & Quality Assurance': [
    { id: 'mq_slo', category: 'Monitoring & Quality Assurance', title: 'Метрики и SLO для AI', description: 'Качество ответов, релевантность', baseHours: 12, defaultRole: 'Analytics', resultImage: 'SLO Table' },
    { id: 'mq_infra', category: 'Monitoring & Quality Assurance', title: 'Мониторинг инфры LLM', description: 'Нагрузка GPU, задержки (latency)', baseHours: 12, defaultRole: 'DevOps', resultImage: 'Grafana GPU' },
    { id: 'mq_resp', category: 'Monitoring & Quality Assurance', title: 'Мониторинг качества ответов', description: 'Сбор фидбеков и авто-оценка', baseHours: 24, defaultRole: 'Development Front', resultImage: 'Quality Dashboard' },
    { id: 'mq_alert', category: 'Monitoring & Quality Assurance', title: 'Настройка алертинга', description: 'Уведомления по критическим порогам', baseHours: 12, defaultRole: 'DevOps', resultImage: 'Alert Manager' },
    { id: 'mq_dash', category: 'Monitoring & Quality Assurance', title: 'Бизнес-дашборды (BI)', description: 'Аналитика использования и ценности', baseHours: 24, defaultRole: 'Analytics', resultImage: 'BI View' },
  ],
  'MCP (Platform Management)': [
    { id: 'mcp_arch', category: 'MCP (Platform Management)', title: 'Архитектура MCP', description: 'Проектирование оркестрации моделей', baseHours: 24, defaultRole: 'Architect', resultImage: 'MCP Schematic' },
    { id: 'mcp_conn', category: 'MCP (Platform Management)', title: 'Подключение LLM к MCP', description: 'Интеграция 1 модели/провайдера', baseHours: 12, defaultRole: 'LLM Architect', resultImage: 'Model Config' },
    { id: 'mcp_route', category: 'MCP (Platform Management)', title: 'Настройка роутинга (MCP)', description: 'Динамическая маршрутизация запросов', baseHours: 16, defaultRole: 'Development Back', resultImage: 'Router rules' },
    { id: 'mcp_quota', category: 'MCP (Platform Management)', title: 'Лимиты и Квоты MCP', description: 'Биллинг и ограничения по командам', baseHours: 16, defaultRole: 'Development Back', resultImage: 'Quota Manager' },
    { id: 'mcp_admin', category: 'MCP (Platform Management)', title: 'Панель админа MCP', description: 'UI для управления платформой', baseHours: 40, defaultRole: 'Development Front', resultImage: 'MCP Admin' },
  ],
  'Advanced Data Engineering': [
    { id: 'de_1', category: 'Advanced Data Engineering', title: 'Data Lake Setup', description: 'Организация хранилища сырых данных', baseHours: 24, defaultRole: 'DevOps', resultImage: 'S3 Buckets' },
    { id: 'de_2', category: 'Advanced Data Engineering', title: 'ETL/ELT Пайплайны', description: 'Обработка данных через Spark/Airflow', baseHours: 32, defaultRole: 'DS/Ai/ML', resultImage: 'DAG View' },
    { id: 'de_3', category: 'Advanced Data Engineering', title: 'Data Validation Rules', description: 'Авто-чеки на качество данных (Great Expectations)', baseHours: 16, defaultRole: 'DS/Ai/ML', resultImage: 'Validation report' },
    { id: 'de_4', category: 'Advanced Data Engineering', title: 'Feature Store Setup', description: 'Хранилище признаков для ML', baseHours: 24, defaultRole: 'DS/Ai/ML', resultImage: 'Feature set' },
    { id: 'de_5', category: 'Advanced Data Engineering', title: 'Стрим-процессинг (Flink)', description: 'Обработка данных в реальном времени', baseHours: 40, defaultRole: 'Development Back', resultImage: 'Stream logs' },
    { id: 'de_6', category: 'Advanced Data Engineering', title: 'Маскирование PII данных', description: 'Анонимизация персональных данных', baseHours: 16, defaultRole: 'Development Back', resultImage: 'Masked JSON' },
    { id: 'de_7', category: 'Advanced Data Engineering', title: 'Data Lineage', description: 'Отслеживание происхождения данных', baseHours: 16, defaultRole: 'DS/Ai/ML', resultImage: 'Lineage Graph' },
    { id: 'de_8', category: 'Advanced Data Engineering', title: 'Change Data Capture (CDC)', description: 'Синхронизация изменений из БД', baseHours: 20, defaultRole: 'DevOps', resultImage: 'Debezium logs' },
    { id: 'de_9', category: 'Advanced Data Engineering', title: 'Каталог данных (Data Catalog)', description: 'Инвентаризация и поиск данных', baseHours: 24, defaultRole: 'Analytics', resultImage: 'Catalog Search' },
    { id: 'de_10', category: 'Advanced Data Engineering', title: 'Data Governance Policy', description: 'Регламенты доступа и использования', baseHours: 12, defaultRole: 'PM', resultImage: 'Policy Doc' },
  ],
  'AI UI/UX Components': [
    { id: 'ux_1', category: 'AI UI/UX Components', title: 'Markdown Renderer', description: 'Поддержка кода, таблиц, формул в чате', baseHours: 8, defaultRole: 'Development Front', resultImage: 'Formatted Text' },
    { id: 'ux_2', category: 'AI UI/UX Components', title: 'Streaming Effects (Typing)', description: 'Эффект печати текста ответа', baseHours: 4, defaultRole: 'Development Front', resultImage: 'Cursor animation' },
    { id: 'ux_3', category: 'AI UI/UX Components', title: 'Citation Links', description: 'Ссылки на источники в ответе LLM', baseHours: 12, defaultRole: 'Development Front', resultImage: 'Source tags' },
    { id: 'ux_4', category: 'AI UI/UX Components', title: 'Suggestion Bubbles', description: 'Быстрые подсказки/вопросы для пользователя', baseHours: 8, defaultRole: 'Development Front', resultImage: 'Pills UI' },
    { id: 'ux_5', category: 'AI UI/UX Components', title: 'Feedback Interaction', description: 'Лайки/дизлайки и окно комментария', baseHours: 12, defaultRole: 'Development Front', resultImage: 'Thumb widgets' },
    { id: 'ux_6', category: 'AI UI/UX Components', title: 'Image Preview Modal', description: 'Просмотр сгенерированных изображений', baseHours: 8, defaultRole: 'Development Front', resultImage: 'Lightbox' },
    { id: 'ux_7', category: 'AI UI/UX Components', title: 'Chat History Sidebar', description: 'Список прошлых диалогов с поиском', baseHours: 16, defaultRole: 'Development Front', resultImage: 'Sidebar list' },
    { id: 'ux_8', category: 'AI UI/UX Components', title: 'Code Copy Button', description: 'Кнопка копирования блоков кода', baseHours: 4, defaultRole: 'Development Front', resultImage: 'Copy success' },
    { id: 'ux_9', category: 'AI UI/UX Components', title: 'Theme Switcher (Dark/Light)', description: 'Поддержка темной темы интерфейса', baseHours: 8, defaultRole: 'Development Front', resultImage: 'Dark mode' },
    { id: 'ux_10', category: 'AI UI/UX Components', title: 'Voice Input (STT) UI', description: 'Индикатор записи и транскрипции', baseHours: 16, defaultRole: 'Development Front', resultImage: 'Waveform' },
  ],
  'Mobile AI Integration': [
    { id: 'mob_1', category: 'Mobile AI Integration', title: 'React Native Boilerplate', description: 'Настройка проекта и навигации', baseHours: 16, defaultRole: 'Development Front', resultImage: 'Mobile Splash' },
    { id: 'mob_2', category: 'Mobile AI Integration', title: 'Mobile Chat Interface', description: 'Оптимизированный UI для чата', baseHours: 24, defaultRole: 'Development Front', resultImage: 'Mobile Chat' },
    { id: 'mob_3', category: 'Mobile AI Integration', title: 'Push Notifications', description: 'Уведомления об ответах агентов', baseHours: 12, defaultRole: 'Development Back', resultImage: 'Push banner' },
    { id: 'mob_4', category: 'Mobile AI Integration', title: 'Offline Mode (Cache)', description: 'Кэширование истории локально', baseHours: 16, defaultRole: 'Development Front', resultImage: 'Offline view' },
    { id: 'mob_5', category: 'Mobile AI Integration', title: 'Deep Links Integration', description: 'Открытие чата по ссылке', baseHours: 8, defaultRole: 'Development Front', resultImage: 'URL config' },
    { id: 'mob_6', category: 'Mobile AI Integration', title: 'Biometric Auth', description: 'FaceID/Fingerprint доступ', baseHours: 12, defaultRole: 'Development Front', resultImage: 'FaceID popup' },
    { id: 'mob_7', category: 'Mobile AI Integration', title: 'Image Upload (Camera)', description: 'Прямая загрузка фото в OCR', baseHours: 12, defaultRole: 'Development Front', resultImage: 'Camera UI' },
    { id: 'mob_8', category: 'Mobile AI Integration', title: 'Voice Interaction (TTS)', description: 'Озвучка ответов через системные API', baseHours: 16, defaultRole: 'Development Front', resultImage: 'Speaker icon' },
    { id: 'mob_9', category: 'Mobile AI Integration', title: 'Store Deployment (iOS)', description: 'Подготовка к App Store', baseHours: 24, defaultRole: 'PM', resultImage: 'TestFlight' },
    { id: 'mob_10', category: 'Mobile AI Integration', title: 'Store Deployment (Android)', description: 'Подготовка к Play Market', baseHours: 24, defaultRole: 'PM', resultImage: 'Google Play consoles' },
  ],
  'Compliance & Security': [
    { id: 'sec_1', category: 'Compliance & Security', title: 'Security Audit (App)', description: 'Скан уязвимостей кода и библиотек', baseHours: 16, defaultRole: 'DevOps', resultImage: 'CVE Report' },
    { id: 'sec_2', category: 'Compliance & Security', title: 'Pentest Manual', description: 'Ручное тестирование на проникновение', baseHours: 40, defaultRole: 'QA', resultImage: 'Hacking report' },
    { id: 'sec_3', category: 'Compliance & Security', title: 'GDPR/152-ФЗ Compliance', description: 'Настройка хранения перс. данных', baseHours: 24, defaultRole: 'Analytics', resultImage: 'Compliance doc' },
    { id: 'sec_4', category: 'Compliance & Security', title: 'LLM Firewall (Guardrails)', description: 'Фильтрация токсичности и утечек', baseHours: 24, defaultRole: 'DS/Ai/ML', resultImage: 'Shield active' },
    { id: 'sec_5', category: 'Compliance & Security', title: 'Audit Logging (Admin)', description: 'Логирование действий администраторов', baseHours: 16, defaultRole: 'Development Back', resultImage: 'Audit trail' },
    { id: 'sec_6', category: 'Compliance & Security', title: 'Encryption at Rest', description: 'Шифрование данных на дисках и в БД', baseHours: 12, defaultRole: 'DevOps', resultImage: 'LUKS/Disk Encryption' },
    { id: 'sec_7', category: 'Compliance & Security', title: 'WAF Setup', description: 'Web Application Firewall (Clouflare/Nginx)', baseHours: 8, defaultRole: 'DevOps', resultImage: 'WAF Logs' },
    { id: 'sec_8', category: 'Compliance & Security', title: 'SOC Integration', description: 'Интеграция логов в SIEM систему', baseHours: 20, defaultRole: 'DevOps', resultImage: 'SIEM events' },
    { id: 'sec_9', category: 'Compliance & Security', title: 'DLP Analysis', description: 'Анализ исходящих данных на секреты', baseHours: 16, defaultRole: 'DS/Ai/ML', resultImage: 'DLP alert' },
    { id: 'sec_10', category: 'Compliance & Security', title: 'Disaster Recovery Plan', description: 'Инструкции и тесты восстановления', baseHours: 24, defaultRole: 'PM', resultImage: 'DRP PDF' },
  ],
};

export const COMPLEXITY_FACTORS = {
  simple: { multiplier: 0.8, label: 'Простой (Типовая задача)' },
  medium: { multiplier: 1.0, label: 'Средний (Стандарт)' },
  complex: { multiplier: 1.3, label: 'Сложный (Высокая неопределенность)' },
  innovative: { multiplier: 1.6, label: 'Инновационный (R&D компонент)' }
};

export const TEAM_MATURITY = {
  junior: { multiplier: 1.5, label: 'Junior-команда' },
  mixed: { multiplier: 1.0, label: 'Смешанная (Mid/Sen)' },
  senior: { multiplier: 0.85, label: 'Senior-команда' },
  expert: { multiplier: 0.75, label: 'Эксперты домена' }
};

export const DATA_QUALITY = {
  excellent: { multiplier: 0.9, label: 'Чистые, размеченные данные' },
  good: { multiplier: 1.0, label: 'Хорошее состояние, миним. препроцессинг' },
  medium: { multiplier: 1.3, label: 'Требуется очистка и нормализация' },
  poor: { multiplier: 1.8, label: 'Грязные данные, отсутствие разметки' }
};

export const MODEL_AVAILABILITY = {
  pretrained_ready: { multiplier: 0.8, label: 'Готовая предобученная модель' },
  pretrained: { multiplier: 1.0, label: 'Предобученная, требует настройки' },
  fine_tuning: { multiplier: 1.4, label: 'Требуется дообучение (Fine-tuning)' },
  from_scratch: { multiplier: 2.0, label: 'Обучение с нуля' }
};

export const RISK_CRITERIA: Record<string, { multiplier: number, description: string }> = {
  r1: { multiplier: 0.15, description: 'Бюджет соответствует ожидаемому объему' },
  r2: { multiplier: 0.20, description: 'Архитектура позволяет глубокую декомпозицию' },
  r3: { multiplier: 0.10, description: 'Цели и результаты прозрачны и зафиксированы' },
  r4: { multiplier: 0.15, description: 'У команды есть опыт в подобных проектах' },
  r5: { multiplier: 0.12, description: 'Заказчик лоялен, границы проекта ясны' },
  r6: { multiplier: 0.08, description: 'Инфраструктура и стек согласованы' },
};

export const RISK_MULTIPLIERS = {
  'Неопределенность RnD': 0.25,
  'Сложность интеграции': 0.15,
  'Ошибки/Баги (Тэстирование)': 0.20,
  'Управленческие накладные расходы': 0.18,
};
