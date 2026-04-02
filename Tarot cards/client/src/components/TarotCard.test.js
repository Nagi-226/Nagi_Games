import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TarotCard from '../components/TarotCard';

describe('TarotCard Component', () => {
  const mockCard = {
    id: 0,
    name: '愚者',
    name_en: 'The Fool',
    type: 'major',
    number: 0,
    keywords: '新的开始,冒险,天真,自发性',
    upright_meaning: '新的开始、冒险、纯真',
    reversed_meaning: '鲁莽、愚蠢的决定',
    symbolism: '悬崖边的旅人',
    element: '气',
    is_reversed: false
  };

  test('renders card correctly', () => {
    render(<TarotCard card={mockCard} isFlipped={false} onFlip={() => {}} showMeaning={false} />);
    expect(screen.getByText(/愚者/)).toBeInTheDocument();
  });

  test('flips card when clicked', () => {
    const onFlip = jest.fn();
    render(<TarotCard card={mockCard} isFlipped={true} onFlip={onFlip} showMeaning={true} />);
    
    fireEvent.click(screen.getByText(/愚者/).closest('.tarot-card'));
    expect(onFlip).toHaveBeenCalled();
  });

  test('shows reversed indicator when card is reversed', () => {
    const reversedCard = { ...mockCard, is_reversed: true };
    render(<TarotCard card={reversedCard} isFlipped={true} onFlip={() => {}} showMeaning={true} />);
    expect(screen.getByText('逆位')).toBeInTheDocument();
  });

  test('displays card meaning when flipped and showMeaning is true', () => {
    render(<TarotCard card={mockCard} isFlipped={true} onFlip={() => {}} showMeaning={true} />);
    expect(screen.getByText(/新的开始/)).toBeInTheDocument();
  });

  test('displays keywords', () => {
    render(<TarotCard card={mockCard} isFlipped={true} onFlip={() => {}} showMeaning={true} />);
    expect(screen.getByText('新的开始')).toBeInTheDocument();
    expect(screen.getByText('冒险')).toBeInTheDocument();
  });
});
