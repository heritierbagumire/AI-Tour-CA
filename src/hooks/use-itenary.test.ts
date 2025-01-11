import { renderHook, act } from '@testing-library/react-hooks';
import { useItinerary } from './use-itenary';
import { ObjectStreamFromResponse } from 'modelfusion';

jest.mock('modelfusion', () => ({
  ObjectStreamFromResponse: jest.fn(),
}));

describe('useItinerary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
});
