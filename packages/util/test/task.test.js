import { Task } from '../src/task';
import * as jest from 'jest-mock';

describe('Task', function () {
  
  function createTask(fn) {
    const runFn = jest.fn();
    const errorFn = jest.fn();
    const doneFn = jest.fn();
    const successFn = jest.fn();
    const progressFn = jest.fn();

    const task = new Task(fn);

    task.on('run', runFn);
    task.on('success', successFn);
    task.on('progress', progressFn);
    task.on('error', errorFn);
    task.on('done', doneFn);

    return {
      task, errorFn, doneFn, successFn, progressFn, runFn
    }
  }

  describe('with success', function () {
    it('emits the success and done events', async function () {
      const {
        task,
        errorFn,
        doneFn,
        successFn,
        progressFn,
        runFn,
      } = createTask(
        async (task) => {
          return 'baked potatoes'
        }
      );

      await task.run();

      expect(runFn).toHaveBeenCalled();
      expect(successFn).toHaveBeenCalledWith('baked potatoes');
      expect(doneFn).toHaveBeenCalled();
      expect(errorFn).not.toHaveBeenCalled();
      expect(progressFn).not.toHaveBeenCalled();
    });
  });

  describe('with error', function () {
    it('emits the error and done events', async function () {
      const {
        task,
        errorFn,
        doneFn,
        successFn,
        progressFn,
        runFn,
      } = createTask(
        async (task) => {
          throw new Error('ohno!');
        }
      );

      try {
        await task.run();
      }
      catch (e) {
        expect(e.message).toMatch('ohno!');
      }

      expect(runFn).toHaveBeenCalled();
      expect(errorFn).toHaveBeenCalled();
      expect(doneFn).toHaveBeenCalled();
      expect(progressFn).not.toHaveBeenCalled();
      expect(successFn).not.toHaveBeenCalled();
    });
  });

  describe('with progress', function () {
    it('emits the progress event', async function () {
      const {
        task,
        errorFn,
        doneFn,
        successFn,
        progressFn,
        runFn,
      } = createTask(async (task) => {
        return new Promise((accept) => {
          task.progress(0.1);
          task.progress(0.5);
          task.progress(0.9);

          setTimeout(accept, 100);
        });
      });

      try {
        await task.run();
      }
      catch (e) {
        expect(e.message).toMatch('ohno!');
      }

      expect(runFn).toHaveBeenCalled();
      expect(errorFn).not.toHaveBeenCalled();
      expect(doneFn).toHaveBeenCalled();
      expect(successFn).toHaveBeenCalled();

      expect(progressFn).toHaveBeenCalledTimes(3);
      expect(progressFn).toHaveBeenNthCalledWith(1, 0.1);
      expect(progressFn).toHaveBeenNthCalledWith(2, 0.5);
      expect(progressFn).toHaveBeenNthCalledWith(3, 0.9);
    });
  });
});