import numpy as np
from scipy.io import wavfile
import math

SAMPLE_RATE = 44100

def save_wav(name, audio):
    audio = np.clip(audio, -1.0, 1.0)
    wavfile.write(name, SAMPLE_RATE, (audio * 32767).astype(np.int16))

def envelope(t, attack, decay, sustain=0, release=0):
    env = np.zeros_like(t)
    for i, time in enumerate(t):
        if time < attack:
            env[i] = time / attack
        elif time < attack + decay:
            env[i] = 1.0 - (1.0 - sustain) * ((time - attack) / decay)
        else:
            env[i] = sustain * max(0, 1.0 - (time - attack - decay) / release) if release > 0 else sustain
    return env

# 1. Ding (Success chime)
t_ding = np.linspace(0, 1.5, int(1.5 * SAMPLE_RATE))
env_ding = np.exp(-t_ding * 4)
ding = (np.sin(2 * np.pi * 880 * t_ding) * 0.6 + np.sin(2 * np.pi * 1760 * t_ding) * 0.4) * env_ding
save_wav('sfx-ding.wav', ding * 0.5)

# 2. Pop (Card appear)
t_pop = np.linspace(0, 0.15, int(0.15 * SAMPLE_RATE))
env_pop = envelope(t_pop, 0.01, 0.14)
# Fast frequency sweep from 400 to 1200
freq_pop = np.linspace(400, 1200, len(t_pop))
phase_pop = np.cumsum(freq_pop) / SAMPLE_RATE
pop = np.sin(2 * np.pi * phase_pop) * env_pop
save_wav('sfx-pop.wav', pop * 0.6)

# 3. Click (Mouse click / sharp UI)
t_click = np.linspace(0, 0.05, int(0.05 * SAMPLE_RATE))
env_click = np.exp(-t_click * 100)
noise_click = np.random.uniform(-1, 1, len(t_click))
# high pass filter simulation by differencing
noise_click[1:] = noise_click[1:] - noise_click[:-1]
click = noise_click * env_click
save_wav('sfx-click.wav', click * 0.5)

# 4. Tick (Digital scan / fast)
t_tick = np.linspace(0, 0.02, int(0.02 * SAMPLE_RATE))
env_tick = np.exp(-t_tick * 200)
tick = np.random.uniform(-1, 1, len(t_tick)) * env_tick
save_wav('sfx-tick.wav', tick * 0.4)

# 5. Boom (Stamp / heavy impact)
t_boom = np.linspace(0, 1.0, int(1.0 * SAMPLE_RATE))
env_boom = np.exp(-t_boom * 3)
freq_boom = np.linspace(100, 20, len(t_boom))
phase_boom = np.cumsum(freq_boom) / SAMPLE_RATE
boom_sine = np.sin(2 * np.pi * phase_boom)
boom_noise = np.random.uniform(-1, 1, len(t_boom)) * np.exp(-t_boom * 15) * 0.5
boom = (boom_sine + boom_noise) * env_boom
save_wav('sfx-boom.wav', boom * 0.7)

# 6. Whoosh (Swipe / transition)
t_whoosh = np.linspace(0, 0.4, int(0.4 * SAMPLE_RATE))
env_whoosh = envelope(t_whoosh, 0.1, 0.3)
noise_whoosh = np.random.uniform(-1, 1, len(t_whoosh))
# Simple lowpass filter simulation
for i in range(1, len(noise_whoosh)):
    noise_whoosh[i] = noise_whoosh[i]*0.2 + noise_whoosh[i-1]*0.8
whoosh = noise_whoosh * env_whoosh
save_wav('sfx-whoosh.wav', whoosh * 0.7)

# 7. Music (120 BPM background)
# 104 seconds long
duration_music = 104
t_music = np.linspace(0, duration_music, duration_music * SAMPLE_RATE)
music = np.zeros_like(t_music)

beat_duration = 0.5 # 120 BPM = 2 beats per second
for b in range(int(duration_music / beat_duration)):
    t_start = b * beat_duration
    start_idx = int(t_start * SAMPLE_RATE)
    
    # Kick drum on the beat
    if b % 2 == 0:
        k_len = int(0.2 * SAMPLE_RATE)
        t_k = np.linspace(0, 0.2, k_len)
        k_freq = np.linspace(150, 40, k_len)
        k_phase = np.cumsum(k_freq) / SAMPLE_RATE
        kick = np.sin(2 * np.pi * k_phase) * np.exp(-t_k * 15)
        
        end_idx = min(start_idx + k_len, len(music))
        music[start_idx:end_idx] += kick[:end_idx-start_idx] * 0.6
        
    # Hi-hat on the offbeat
    else:
        h_len = int(0.05 * SAMPLE_RATE)
        t_h = np.linspace(0, 0.05, h_len)
        hat = np.random.uniform(-1, 1, h_len) * np.exp(-t_h * 50)
        # high pass
        hat[1:] = hat[1:] - hat[:-1]
        
        end_idx = min(start_idx + h_len, len(music))
        music[start_idx:end_idx] += hat[:end_idx-start_idx] * 0.3
        
    # Bass drone every 4 beats
    if b % 8 == 0:
        d_len = int(2.0 * SAMPLE_RATE)
        t_d = np.linspace(0, 2.0, d_len)
        drone = np.sin(2 * np.pi * 55 * t_d) * envelope(t_d, 0.5, 1.5)
        end_idx = min(start_idx + d_len, len(music))
        music[start_idx:end_idx] += drone[:end_idx-start_idx] * 0.3

save_wav('music.wav', music * 0.4)

print("All audio files generated successfully!")
