import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RowWithAyah from '../RowWithAyah';
import { useUser } from '../../../context/UserContext';
import { fetchNote, saveNote } from '../../services/noteService';
import { toggleBookmark, getBookmarks } from '../../services/bookmarkService';
import { Audio } from 'expo-av';

// Mocking dependencies
jest.mock('../../../context/UserContext', () => ({
  useUser: jest.fn(),
}));
jest.mock('../../services/noteService', () => ({
  fetchNote: jest.fn(),
  saveNote: jest.fn(),
}));
jest.mock('../../services/bookmarkService', () => ({
  toggleBookmark: jest.fn(),
  getBookmarks: jest.fn(),
}));

global.alert = jest.fn();

jest.mock('expo-av', () => ({
    Audio: {
      requestPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
      Sound: jest.fn().mockImplementation(() => ({
        playAsync: jest.fn(),
        unloadAsync: jest.fn(),
        setOnPlaybackStatusUpdate: jest.fn(),
      })),
      Sound: {
        createAsync: jest.fn().mockResolvedValue({
          sound: {
            playAsync: jest.fn(),
            unloadAsync: jest.fn(),
            setOnPlaybackStatusUpdate: jest.fn(),
          },
        }),
      },
    },
  }));
  
  

describe('RowWithAyah Component', () => {
  beforeEach(() => {
    useUser.mockReturnValue({
      user: { id: 1, role: 'student' },
    });

    getBookmarks.mockResolvedValue([]);
    fetchNote.mockResolvedValue('');
    saveNote.mockResolvedValue(true);
    toggleBookmark.mockResolvedValue({ bookmarked: true });
  });

  it('renders correctly with Arabic and English Ayah text', () => {
    const { getByText } = render(
      <RowWithAyah 
        number={1}
        surahId={1}
        arabicText="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
        englishText="In the name of Allah, the Most Gracious, the Most Merciful."
        allWords={['بِسْمِ', 'اللَّهِ', 'الرَّحْمَٰنِ', 'الرَّحِيمِ']}
        mappedWords={['بِسْمِ', 'اللَّهِ', 'الرَّحْمَٰنِ', 'الرَّحِيمِ']}
      />
    );

    expect(getByText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ')).toBeTruthy();
    expect(getByText('In the name of Allah, the Most Gracious, the Most Merciful.')).toBeTruthy();
  });

  it('fetches and displays a note when note icon is pressed', async () => {
    fetchNote.mockResolvedValue('This is a saved note.');

    const { getByTestId, getByPlaceholderText } = render(
      <RowWithAyah 
        number={2}
        surahId={1}
        allWords={[]}
      />
    );

    const noteButton = getByTestId('note-icon');
    fireEvent.press(noteButton);

    await waitFor(() => {
      const textArea = getByPlaceholderText('Add a Note to this Ayah');
      expect(textArea.props.value).toBe('This is a saved note.');
    });
  });

  it('saves a note when note text is entered and icon is pressed again', async () => {
    fetchNote.mockResolvedValue('');
    saveNote.mockResolvedValue(true);

    const { getByTestId, getByPlaceholderText } = render(
      <RowWithAyah number={3} surahId={1} allWords={[]}/>
    );

    const noteButton = getByTestId('note-icon');
    fireEvent.press(noteButton);

    await waitFor(() => {
      const textArea = getByPlaceholderText('Add a Note to this Ayah');
      fireEvent.changeText(textArea, 'New note content');
    });

    fireEvent.press(noteButton);

    await waitFor(() => {
      expect(saveNote).toHaveBeenCalledWith(expect.any(Object), 1, 3, 'New note content');
    });
  });

  it('toggles bookmark state when bookmark icon is pressed', async () => {
    toggleBookmark.mockResolvedValue({ bookmarked: true });

    const { getByTestId } = render(<RowWithAyah number={4} surahId={1} allWords={[]} />);
    const bookmarkButton = getByTestId('bookmark-icon');

    fireEvent.press(bookmarkButton);

    await waitFor(() => {
      expect(toggleBookmark).toHaveBeenCalledWith(expect.any(Number), expect.any(String), 1, 4);
    });
  });

  it('plays audio when play button is pressed', async () => {
    const { getByTestId } = render(<RowWithAyah number={5} surahId={1} allWords={[]} />);
    const playButton = getByTestId('play-icon');
  
    fireEvent.press(playButton);
  
    await waitFor(() => {
      // ✅ Now this works because we correctly mocked `Audio.Sound.createAsync`
      expect(Audio.Sound.createAsync).toHaveBeenCalled();
    });
  });
  
  

  it('displays word meaning modal when word is long-pressed', async () => {
    const { getByText } = render(
      <RowWithAyah 
        number={6}
        surahId={1}
        allWords={['بِسْمِ', 'اللَّهِ']}
        mappedWords={['بِسْمِ', 'اللَّهِ']}
      />
    );

    const word = getByText('بِسْمِ');
    fireEvent(word, 'onLongPress');

    await waitFor(() => {
      expect(getByText('Word Meaning')).toBeTruthy();
    });
  });
});
