// tests/topics-master/TopicsMasterProvider.test.tsx
import { renderHook, act } from '@testing-library/react';
import { TopicsMasterProvider, useTopicsMaster } from '../../app/_providers/TopicsMasterProvider';

describe('TopicsMasterProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should set and update the meeting theme', () => {
    const { result } = renderHook(() => useTopicsMaster(), {
      wrapper: TopicsMasterProvider,
    });

    act(() => {
      result.current.setTheme('The Power of Habit');
    });

    expect(result.current.session.theme).toBe('The Power of Habit');
  });

  it('should add a topic', () => {
    const { result } = renderHook(() => useTopicsMaster(), {
      wrapper: TopicsMasterProvider,
    });

    act(() => {
      result.current.addTopic('If you could live anywhere in the world, where would it be?');
    });

    expect(result.current.session.topics.length).toBe(1);
    expect(result.current.session.topics[0].text).toBe(
      'If you could live anywhere in the world, where would it be?'
    );
  });

  it('should trim whitespace when adding a topic', () => {
    const { result } = renderHook(() => useTopicsMaster(), {
      wrapper: TopicsMasterProvider,
    });

    act(() => {
      result.current.addTopic('  Leading spaces  ');
    });

    expect(result.current.session.topics[0].text).toBe('Leading spaces');
  });

  it('should not add an empty topic', () => {
    const { result } = renderHook(() => useTopicsMaster(), {
      wrapper: TopicsMasterProvider,
    });

    act(() => {
      result.current.addTopic('   ');
    });

    expect(result.current.session.topics.length).toBe(0);
  });

  it('should remove a topic by id', () => {
    const { result } = renderHook(() => useTopicsMaster(), {
      wrapper: TopicsMasterProvider,
    });

    act(() => {
      result.current.addTopic('Topic A');
      result.current.addTopic('Topic B');
    });

    const idToRemove = result.current.session.topics[0].id;

    act(() => {
      result.current.removeTopic(idToRemove);
    });

    expect(result.current.session.topics.length).toBe(1);
    expect(result.current.session.topics[0].text).toBe('Topic B');
  });

  it('should log a speaker with a topic', () => {
    const { result } = renderHook(() => useTopicsMaster(), {
      wrapper: TopicsMasterProvider,
    });

    act(() => {
      result.current.addTopic('What inspires you?');
    });

    const topic = result.current.session.topics[0];

    act(() => {
      result.current.logSpeaker('Jane Doe', topic);
    });

    expect(result.current.session.log.length).toBe(1);
    expect(result.current.session.log[0].speakerName).toBe('Jane Doe');
    expect(result.current.session.log[0].topic.text).toBe('What inspires you?');
  });

  it('should not log a speaker with an empty name', () => {
    const { result } = renderHook(() => useTopicsMaster(), {
      wrapper: TopicsMasterProvider,
    });

    act(() => {
      result.current.addTopic('Some topic');
    });

    const topic = result.current.session.topics[0];

    act(() => {
      result.current.logSpeaker('   ', topic);
    });

    expect(result.current.session.log.length).toBe(0);
  });

  it('should remove a log entry by id', () => {
    const { result } = renderHook(() => useTopicsMaster(), {
      wrapper: TopicsMasterProvider,
    });

    act(() => {
      result.current.addTopic('Topic A');
      result.current.addTopic('Topic B');
    });

    const [topicA, topicB] = result.current.session.topics;

    act(() => {
      result.current.logSpeaker('Alice', topicA);
      result.current.logSpeaker('Bob', topicB);
    });

    const entryToRemove = result.current.session.log[0].id;

    act(() => {
      result.current.removeLogEntry(entryToRemove);
    });

    expect(result.current.session.log.length).toBe(1);
    expect(result.current.session.log[0].speakerName).toBe('Bob');
  });

  it('should allow the same topic to be assigned to multiple speakers', () => {
    const { result } = renderHook(() => useTopicsMaster(), {
      wrapper: TopicsMasterProvider,
    });

    act(() => {
      result.current.addTopic('Reusable topic');
    });

    const topic = result.current.session.topics[0];

    act(() => {
      result.current.logSpeaker('Alice', topic);
      result.current.logSpeaker('Bob', topic);
    });

    expect(result.current.session.log.length).toBe(2);
    expect(result.current.session.log[0].topic.id).toBe(result.current.session.log[1].topic.id);
  });

  it('should add generated topics with metadata', () => {
    const { result } = renderHook(() => useTopicsMaster(), {
      wrapper: TopicsMasterProvider,
    });

    act(() => {
      result.current.addGeneratedTopics(['Question one?', '  Question two?  ', '   '], 'hard');
    });

    expect(result.current.session.topics.length).toBe(2);
    expect(result.current.session.topics[0]).toMatchObject({
      text: 'Question one?',
      source: 'generated',
      difficulty: 'hard',
    });
    expect(result.current.session.topics[1].text).toBe('Question two?');
  });

  it('should mark a generated topic as edited on inline edit, but not a manual one', () => {
    const { result } = renderHook(() => useTopicsMaster(), {
      wrapper: TopicsMasterProvider,
    });

    act(() => {
      result.current.addTopic('Manual topic');
      result.current.addGeneratedTopics(['Generated topic?'], 'easy');
    });

    const [manual, generated] = result.current.session.topics;

    act(() => {
      result.current.updateTopicText(manual.id, 'Manual topic (edited)');
      result.current.updateTopicText(generated.id, 'Generated topic (edited)?');
    });

    expect(result.current.session.topics[0].text).toBe('Manual topic (edited)');
    expect(result.current.session.topics[0].edited).toBeUndefined();
    expect(result.current.session.topics[1].text).toBe('Generated topic (edited)?');
    expect(result.current.session.topics[1].edited).toBe(true);
  });

  it('should not update a topic to empty text', () => {
    const { result } = renderHook(() => useTopicsMaster(), {
      wrapper: TopicsMasterProvider,
    });

    act(() => {
      result.current.addTopic('Keep me');
    });

    act(() => {
      result.current.updateTopicText(result.current.session.topics[0].id, '   ');
    });

    expect(result.current.session.topics[0].text).toBe('Keep me');
  });

  it('should replace only the targeted topic text and clear the edited flag on regeneration', () => {
    const { result } = renderHook(() => useTopicsMaster(), {
      wrapper: TopicsMasterProvider,
    });

    act(() => {
      result.current.addGeneratedTopics(['First?', 'Second?', 'Third?'], 'easy');
    });

    const second = result.current.session.topics[1];

    act(() => {
      result.current.updateTopicText(second.id, 'Second, edited?');
    });

    act(() => {
      result.current.replaceTopicText(second.id, 'A fresh replacement?');
    });

    expect(result.current.session.topics.map(t => t.text)).toEqual([
      'First?',
      'A fresh replacement?',
      'Third?',
    ]);
    expect(result.current.session.topics[1].edited).toBe(false);
    expect(result.current.session.topics[1].id).toBe(second.id);
  });

  it('should remove only unused topics, keeping ones assigned in the log', () => {
    const { result } = renderHook(() => useTopicsMaster(), {
      wrapper: TopicsMasterProvider,
    });

    act(() => {
      result.current.addTopic('Used topic');
      result.current.addTopic('Unused topic');
    });

    const used = result.current.session.topics[0];

    act(() => {
      result.current.logSpeaker('Alice', used);
    });

    act(() => {
      result.current.removeUnusedTopics();
    });

    expect(result.current.session.topics.length).toBe(1);
    expect(result.current.session.topics[0].text).toBe('Used topic');
    expect(result.current.session.log.length).toBe(1);
  });

  it('should reset the session', () => {
    const { result } = renderHook(() => useTopicsMaster(), {
      wrapper: TopicsMasterProvider,
    });

    act(() => {
      result.current.setTheme('Test Theme');
      result.current.addTopic('Some topic');
    });

    act(() => {
      result.current.resetSession();
    });

    expect(result.current.session.theme).toBe('');
    expect(result.current.session.topics.length).toBe(0);
    expect(result.current.session.log.length).toBe(0);
  });
});
