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
