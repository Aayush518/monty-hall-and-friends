import random

def advanced_monty_hall_simulation(switch: bool, trials: int, num_doors: int) -> float:
    wins = 0
    for _ in range(trials):
        doors = ['goat'] * (num_doors - 1) + ['car']
        random.shuffle(doors)
        chosen_door = random.randint(0, num_doors - 1)
        
        revealed_doors = [i for i in range(num_doors) if i != chosen_door and doors[i] == 'goat']
        revealed_doors = revealed_doors[:num_doors - 2]
        
        if switch:
            remaining_doors = [i for i in range(num_doors) if i != chosen_door and i not in revealed_doors]
            chosen_door = random.choice(remaining_doors)
        
        if doors[chosen_door] == 'car':
            wins += 1
    
    win_percentage = (wins / trials) * 100
    return win_percentage