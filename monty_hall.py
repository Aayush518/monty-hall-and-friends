import random

def monty_hall_simulation(switch: bool, trials: int) -> float:
    wins = 0
    for _ in range(trials):
        doors = [0, 0, 1]  # 0 - goat, 1 - car
        random.shuffle(doors)
        chosen_door = random.randint(0, 2)
        revealed_door = next(d for d in range(3) if d != chosen_door and doors[d] == 0)
        
        if switch:
            chosen_door = next(d for d in range(3) if d != chosen_door and d != revealed_door)
        
        if doors[chosen_door] == 1:
            wins += 1
    
    win_percentage = (wins / trials) * 100
    return win_percentage