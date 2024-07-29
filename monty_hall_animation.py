from manim import *

config.frame_width = 16
config.frame_height = 9

class MontyHallDetailedExplanation(Scene):
    def construct(self):
        self.camera.frame_width = 16
        self.camera.frame_height = 9
        
        self.intro()
        self.initial_setup()
        self.player_choice()
        self.host_opens_door()
        self.host_offers_switch()
        self.probability_update()
        self.mathematical_breakdown()
        self.simulation_results()
        self.conclusion()

    def intro(self):
        self.title = Text("The Monty Hall Problem", font_size=72).to_edge(UP, buff=0.5)
        self.play(Write(self.title))
        self.wait()

        intro_text = VGroup(
            Text("A classic probability puzzle", font_size=36),
            Text("that challenges our intuition", font_size=36)
        ).arrange(DOWN, buff=0.3)
        intro_text.next_to(self.title, DOWN, buff=0.5)
        self.play(Write(intro_text))
        self.wait(2)
        self.play(FadeOut(intro_text))

    def initial_setup(self):
        doors = VGroup(*[Rectangle(height=3, width=1.5, fill_opacity=0.8, fill_color=BLUE) for _ in range(3)])
        doors.arrange(RIGHT, buff=0.5).scale(0.8)
        door_labels = VGroup(*[Text(f"Door {i+1}", font_size=24).next_to(door, DOWN) for i, door in enumerate(doors)])
        
        doors_group = VGroup(doors, door_labels).center()
        self.play(Create(doors_group))
        
        setup_text = VGroup(
            Text("1 car behind one door", font_size=32),
            Text("2 goats behind the other doors", font_size=32)
        ).arrange(DOWN, buff=0.3)
        setup_text.next_to(doors_group, DOWN, buff=0.5)
        
        self.play(Write(setup_text))
        self.wait(2)
        self.play(FadeOut(setup_text))

        prob_labels = VGroup(*[Text(f"1/3", font_size=32).move_to(door) for door in doors])
        self.play(Write(prob_labels))
        self.wait()

        self.doors = doors
        self.door_labels = door_labels
        self.prob_labels = prob_labels

    def player_choice(self):
        choice_text = Text("You choose Door 1", font_size=32).next_to(self.doors, DOWN, buff=1)
        self.play(Write(choice_text))
        self.wait()
        
        # Animate the door "opening" slightly
        door_opening = self.doors[0].copy()
        door_opening.set_fill(opacity=0.5)
        self.play(Transform(self.doors[0], door_opening))
        self.wait()
        
        self.play(FadeOut(choice_text))

    def host_opens_door(self):
        host_text = Text("The host opens Door 3", font_size=32).next_to(self.doors, DOWN, buff=1)
        self.play(Write(host_text))
        self.wait()
        
        # Animate the door opening and revealing a goat
        door_opening = self.doors[2].copy()
        door_opening.set_fill(opacity=0.3)
        goat = Text("🐐", font_size=48).move_to(self.doors[2])
        self.play(Transform(self.doors[2], door_opening), FadeIn(goat))
        self.wait()
        
        reveal_text = Text("revealing a goat", font_size=32).next_to(host_text, DOWN)
        self.play(Write(reveal_text))
        self.wait(2)
        
        self.play(FadeOut(host_text), FadeOut(reveal_text), FadeOut(goat))

    def host_offers_switch(self):
        offer_text = Text("The host asks: 'Do you want to switch to Door 2?'", font_size=32).next_to(self.doors, DOWN, buff=1)
        self.play(Write(offer_text))
        self.wait(2)
        self.play(FadeOut(offer_text))

    def probability_update(self):
        new_probs = VGroup(
            Text("1/3", font_size=32).move_to(self.doors[0]),
            Text("2/3", font_size=32).move_to(self.doors[1]),
            Text("0", font_size=32).move_to(self.doors[2])
        )
        prob_explanation = Text("Probability shifts to the unopened door", font_size=32).next_to(self.doors, DOWN, buff=1)
        self.play(Transform(self.prob_labels, new_probs), Write(prob_explanation))
        self.wait(2)
        self.play(FadeOut(prob_explanation), FadeOut(self.doors), FadeOut(self.door_labels), FadeOut(self.prob_labels))
        self.play(FadeOut(self.title))  # Remove the title before mathematical explanation

    def mathematical_breakdown(self):
        title = Text("Mathematical Breakdown", font_size=48).to_edge(UP, buff=0.5)
        self.play(Write(title))

        equations = VGroup(
            MathTex(r"P(\text{Car behind Door i}) = \frac{1}{3}, \quad i = 1, 2, 3", font_size=32),
            MathTex(r"P(\text{Win by switching} | \text{Host opens Door 3}) = \frac{P(\text{Host opens Door 3} | \text{Car behind Door 2}) \cdot P(\text{Car behind Door 2})}{P(\text{Host opens Door 3})}", font_size=32),
            MathTex(r"P(\text{Host opens Door 3} | \text{Car behind Door 2}) = 1", font_size=32),
            MathTex(r"P(\text{Car behind Door 2}) = \frac{1}{3}", font_size=32),
            MathTex(r"P(\text{Host opens Door 3}) = \frac{1}{3} \cdot \frac{1}{2} + \frac{1}{3} \cdot 1 + \frac{1}{3} \cdot 0 = \frac{1}{2}", font_size=32),
            MathTex(r"P(\text{Win by switching}) = \frac{1 \cdot \frac{1}{3}}{\frac{1}{2}} = \frac{2}{3}", font_size=32)
        ).arrange(DOWN, buff=0.4, aligned_edge=LEFT)
        equations.next_to(title, DOWN, buff=0.5)

        for eq in equations:
            self.play(Write(eq))
            self.wait(1)

        self.wait(2)
        self.play(FadeOut(equations), FadeOut(title))

    def simulation_results(self):
        trials = 1000
        stay_wins = 333  # Approximate for 1000 trials
        switch_wins = 667  # Approximate for 1000 trials

        title = Text("Simulation Results", font_size=48).to_edge(UP, buff=0.5)
        self.play(Write(title))

        trial_text = Text(f"After {trials} trials:", font_size=36).next_to(title, DOWN, buff=0.5)
        self.play(Write(trial_text))

        stay_bar = Rectangle(height=stay_wins / 1000 * 5, width=1.5, fill_color=BLUE, fill_opacity=0.8)
        switch_bar = Rectangle(height=switch_wins / 1000 * 5, width=1.5, fill_color=GREEN, fill_opacity=0.8)
        bars = VGroup(stay_bar, switch_bar).arrange(RIGHT, buff=2).scale(0.7).next_to(trial_text, DOWN, buff=1)

        stay_label = Text("Stay", font_size=32).next_to(stay_bar, DOWN)
        switch_label = Text("Switch", font_size=32).next_to(switch_bar, DOWN)
        stay_value = Text(f"{stay_wins}/{trials}\n({stay_wins / trials:.1%})", font_size=28).next_to(stay_bar, UP)
        switch_value = Text(f"{switch_wins}/{trials}\n({switch_wins / trials:.1%})", font_size=28).next_to(switch_bar, UP)

        self.play(
            Create(bars),
            Write(VGroup(stay_label, switch_label, stay_value, switch_value))
        )
        self.wait(2)
        self.play(FadeOut(title), FadeOut(trial_text), FadeOut(bars), FadeOut(stay_label), FadeOut(switch_label), FadeOut(stay_value), FadeOut(switch_value))

    def conclusion(self):
        title = Text("Conclusion", font_size=48).to_edge(UP, buff=0.5)
        self.play(Write(title))

        conclusion_points = VGroup(
            Text("• Switching is the better strategy.", font_size=36),
            Text("• Probability of winning by switching is 2/3.", font_size=36),
            Text("• This problem highlights the importance of updating probabilities.", font_size=36)
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.5).next_to(title, DOWN, buff=0.5)
        
        for point in conclusion_points:
            self.play(Write(point))
            self.wait(1)

        self.wait(2)
