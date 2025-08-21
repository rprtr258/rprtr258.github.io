# Ссылки и источники

## Книги

- **Cindy Sridharan — "Distributed Systems Observability" (O'Reilly, 2018)**
  Оригинальный текст, закрепивший термин «три столпа observability».
  https://www.oreilly.com/library/view/distributed-systems-observability/9781492033431/

- **Martin Kleppmann — "Designing Data-Intensive Applications" (O'Reilly, 2017)**
  Глава 10 (Batch Processing) — Sushi Principle, raw data is better.
  https://dataintensive.net/

## Wide events — критика трёх столпов

- **Ben Sigelman (LightStep) — "Debunking the 'Three Pillars of Observability' Myth" (2021)**
  Главный программный текст против трёх столпов. Тезис: метрики, логи, трейсы — это просто биты, не pillars.
  https://lightstep.com/blog/debunking-the-three-pillars-of-observability-myth

- **Charity Majors (Honeycomb) — "It's Time to Version Observability" (2024)**
  Observability 1.0 → 2.0. Wide events как единый source of truth.
  https://www.honeycomb.io/blog/time-to-version-observability-signs-point-to-yes

- **Ilya Burmistrov — "All You Need Is Wide Events, Not 'Metrics, Logs and Traces'" (2024)**
  Радикальный взгляд. Опыт Scuba в Facebook. Три столпа = частные случаи wide events.
  https://isburmistrov.substack.com/p/all-you-need-is-wide-events-not-metrics

- **Jeremy Morrell — "A Practitioner's Guide to Wide Events" (2024)**
  Самая полная vendor-neutral статья. Практические аспекты, ограничения, критерии выбора.
  https://jeremymorrell.dev/blog/a-practitioners-guide-to-wide-events/

- **Boris Tane — "Observability Wide Events 101" (2025)**
  Введение в термин wide events.
  https://boristane.medium.com/observability-wide-events-101-9362894853b1

- **Alok Kumar Singh — "Observability 2.0 — Observability Is About Asking Any Question" (2025)**
  Критика совета «логировать меньше». Wide events с high cardinality.
  https://medium.com/@alokkumarsingh02010/observability-2-0-observability-is-about-asking-any-question-8abf30b5d8c0

- **Greptime — "Wide Events, Explained: The Data Model Behind Observability 2.0" (2026)**
  Технический обзор с диаграммами. Почему columnar storage + object storage сделали это возможным.
  https://greptime.com/tech-content/2026-06-10-wide-events-observability-2-0

- **Parseable — "Decision Framework: Wide Events or Traces?" (2025)**
  Сравнение wide events vs traces — что когда выбирать.
  https://parseable.io/blog/wide-events-or-traces

- **Stripe — "Canonical Log Lines"**
  Практика Stripe: один rich structured log-line на запрос.
  https://stripe.com/blog/canonical-log-lines

- **Software Engineering Daily — "Debunking the Three Pillars" (2021)**
  Подробный разбор недостатков каждого столпа.
  https://softwareengineeringdaily.com/2021/05/05/debunking-the-three-pillars-of-observability/

- **O11yTime — "The Three Pillars Revisited" (2024)**
  Три столпа не проблема, проблема — разрозненность.
  https://o11ytime.com/posts/the-three-pillars-revisited/

- **Scuba paper — "Scuba: Diving into Data at Facebook" (VLDB 2013)**
  Оригинальная paper про wide events engine в Facebook.
  https://vldb.org/pvldb/vol6/p1057-wiener.pdf

## Классические тексты Питера Бургона

- **"Logging v. Instrumentation" (2016)**
  Логи — только для actionability, USE/RED methods.
  https://peter.bourgon.org/blog/2016/02/07/logging-v-instrumentation.html

- **"Metrics, Tracing, and Logging" (2017)**
  Оригинальная Venn-диаграмма трёх сигналов. Автор самого разделения.
  https://peter.bourgon.org/blog/2017/02/21/metrics-tracing-and-logging.html

- **"Observability Signals" (2018)**
  Ключевое эссе. Все сигналы — одна сущность под разными оптимизациями. Предсказание über-system.
  https://peter.bourgon.org/blog/2018/08/22/observability-signals.html

## Sushi Principle

- **Bobby Johnson, Joseph Adler — "The Sushi Principle: Raw Data Is Better"**
  Презентация на Strata+Hadoop World 2015. Первоисточник термина.
  (цитируется в DDIA, гл.10)

- **Scuba Blog — "Why All Your Data Should Be Raw"**
  Применение Sushi Principle к observability-данным.
  https://blog.scuba.io/why-all-your-data-should-be-raw

## Observability vs Monitoring vs Telemetry — терминология

- **IBM — "What is telemetry?"**
  Определение: «Telemetry is the automated collection and transmission of data and measurements from distributed or remote sources to a central system for monitoring, analysis and resource optimization.»
  https://www.ibm.com/think/topics/telemetry

- **Splunk — "Monitoring vs Observability vs Telemetry: What's The Difference?"**
  https://www.splunk.com/en_us/blog/learn/observability-vs-monitoring-vs-telemetry.html

- **Icinga — "Observability vs. Monitoring vs. Telemetry - Key Differences Explained"**
  https://icinga.com/blog/understanding-observability-monitoring-and-telemetry-differences/

- **Cribl — "Observability vs Monitoring vs Telemetry"**
  https://cribl.io/blog/observability-vs-monitoring-vs-telemetry/

## Control Theory — формальное определение observability

- **Rudolf Kalman — "On the General Theory of Control Systems" (1960)**
  Оригинальная работа, вводящая observability как математическое свойство LTI-систем.

- **Wikipedia — "Observability"**
  Формальное определение, матрица наблюдаемости.
  https://en.wikipedia.org/wiki/Observability

- **Honeycomb — "Observability: The New Wave for Incident Response"**
  Charity Majors о разнице между software observability и control theory.
  https://www.honeycomb.io/blog/observability-the-new-wave-for-incident-response

- **Peter Bourgon — "Observability Signals"** (уже указан выше)
  Содержит разбор, почему control theory observability не переносится напрямую на софт.

## Технологии

- **OpenTelemetry** — стандарт сбора и передачи телеметрии
  https://opentelemetry.io/

- **GreptimeDB** — open-source columnar observability database (Rust)
  https://github.com/GreptimeTeam/greptimedb

- **ClickHouse** — columnar analytics database
  https://clickhouse.com/

- **Honeycomb** — hosted wide events observability platform
  https://www.honeycomb.io/
