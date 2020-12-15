import { Injectable } from '@angular/core';

export interface FamilyMember {
  name: string;
  id: string;
  relatedTo: string[];
}

@Injectable({
  providedIn: 'root',
})
export class SimpsonsService {
  private readonly family: FamilyMember[] = [
    { name: 'Homer Simpson', id: '1', relatedTo: ['2', '3', '4', '5', '6'] },
    {
      name: 'Marge Simpson',
      id: '2',
      relatedTo: ['1', '3', '4', '5', '7', '8'],
    },
    {
      name: 'Bart Simpson',
      id: '3',
      relatedTo: ['1', '2', '4', '5', '6', '7', '8'],
    },
    {
      name: 'Lisa Simpson',
      id: '4',
      relatedTo: ['1', '2', '3', '5', '6', '7', '8'],
    },
    {
      name: 'Maggie Simpson',
      id: '5',
      relatedTo: ['1', '2', '3', '4', '6', '7', '8'],
    },
    { name: 'Abe Simpson', id: '6', relatedTo: ['1', '3', '4', '5'] },
    { name: 'Patty Bouvier', id: '7', relatedTo: ['2', '3', '4', '5', '8'] },
    { name: 'Selma Bouvier', id: '8', relatedTo: ['2', '3', '4', '5', '7'] },
  ];

  getAll(): FamilyMember[] {
    return this.family.slice();
  }

  getMember(id: string): FamilyMember {
    return this.family.find((m) => m.id === id);
  }

  getRelatives(id: string): FamilyMember[] {
    const member = this.getMember(id);
    return member
      ? this.family.filter((m) => member.relatedTo.includes(m.id))
      : [];
  }
}
