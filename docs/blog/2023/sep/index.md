# Month report

Перешел с notion на todoist для трекинга задач, проблема с тем что приложуха большая и непонятно где что искать и как пользоваться решена, осталась проблема делать эти задачи. Прикольная фича todoist это то что все запланированные (с due date) дела жестко планируются и помечаются как просроченые, если их не пометить как сделанные, и приходится их переносить и постоянно держать в списке дел на сегодня.

Делаю несколько пет проектов, среди них:
- либа для тестирования, которая будет тайпсейф и принтить читаемые и красивые диффы в отличие от testify/assert с go-difflib
- процесс менеджер пилю потихоньку, к сожалению ни один из существующих вотчеров файлов на го не поддерживает рекурсивный вотч директорий, поэтому либо придется костылить с ними либо писать свои костыли. Перешел с slog на zerolog с более приятным апи.
- cli для запросов с связанных сущностей, около-graphql только с более компактным синтаксисом и произвольными фильтрами. Пока что в очень экспериментальной стадии и даже не залит на гитхаб.

Для этих проектов нужно красить текст в терминале, что неудобно делать существующими либами (как по мне) поэтому выкатил еще одну, получается хоть что-то сделал: https://github.com/rprtr258/scuf/