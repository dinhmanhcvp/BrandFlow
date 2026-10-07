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

# 1. Soft Ding (Soft plan/report appearance)
t_ding = np.linspace(0, 1.5, int(1.5 * SAMPLE_RATE))
env_ding = np.exp(-t_ding * 5)
# Soft FM synthesis or just sine waves
ding = (np.sin(2 * np.pi * 600 * t_ding) * 0.7 + np.sin(2 * np.pi * 1200 * t_ding) * 0.3) * env_ding
save_wav('sfx-ding.wav', ding * 0.25)

# 2. Short Click (File drop, agent appear)
t_click = np.linspace(0, 0.03, int(0.03 * SAMPLE_RATE))
env_click = np.exp(-t_click * 150)
click = np.random.uniform(-1, 1, len(t_click)) * env_click
# Lowpass filter the click to make it softer
for i in range(1, len(click)):
    click[i] = click[i]*0.3 + click[i-1]*0.7
save_wav('sfx-click.wav', click * 0.3)

# 3. Light Whoosh (Transitions)
t_whoosh = np.linspace(0, 0.6, int(0.6 * SAMPLE_RATE))
env_whoosh = envelope(t_whoosh, 0.2, 0.4)
whoosh = np.random.uniform(-1, 1, len(t_whoosh))
for i in range(1, len(whoosh)):
    whoosh[i] = whoosh[i]*0.05 + whoosh[i-1]*0.95 # Heavy lowpass
whoosh = whoosh * env_whoosh
save_wav('sfx-whoosh.wav', whoosh * 0.4)

# 4. Riser (Before Brand Flow)
t_riser = np.linspace(0, 1.5, int(1.5 * SAMPLE_RATE))
env_riser = envelope(t_riser, 1.4, 0.1)
freq_riser = np.linspace(200, 800, len(t_riser))
phase_riser = np.cumsum(freq_riser) / SAMPLE_RATE
riser = np.sin(2 * np.pi * phase_riser) * env_riser
save_wav('sfx-riser.wav', riser * 0.2)

# 5. Heavy Hit (Final logo)
t_boom = np.linspace(0, 1.5, int(1.5 * SAMPLE_RATE))
env_boom = np.exp(-t_boom * 2.5)
freq_boom = np.linspace(80, 20, len(t_boom))
phase_boom = np.cumsum(freq_boom) / SAMPLE_RATE
boom_sine = np.sin(2 * np.pi * phase_boom)
boom_noise = np.random.uniform(-1, 1, len(t_boom)) * np.exp(-t_boom * 10) * 0.3
for i in range(1, len(boom_noise)):
    boom_noise[i] = boom_noise[i]*0.1 + boom_noise[i-1]*0.9
boom = (boom_sine + boom_noise) * env_boom
save_wav('sfx-boom.wav', boom * 0.6)

# 6. Minimal Electronic Music
duration_music = 104
t_music = np.linspace(0, duration_music, duration_music * SAMPLE_RATE)
music = np.zeros_like(t_music)
beat_duration = 0.5 # 120 BPM

for b in range(int(duration_music / beat_duration)):
    t_start = b * beat_duration
    start_idx = int(t_start * SAMPLE_RATE)
    time_sec = t_start
    
    # PAD & BASS (Continuous but pulsing every beat)
    if time_sec < 96:
        # Simple minor chord pad (A minorish)
        pad_len = int(beat_duration * SAMPLE_RATE)
        t_p = np.linspace(0, beat_duration, pad_len)
        pad = (np.sin(2*np.pi*220*t_p) + np.sin(2*np.pi*261.6*t_p) + np.sin(2*np.pi*329.6*t_p)) * 0.1
        # Duck the pad on the beat (sidechain simulation)
        pad = pad * envelope(t_p, 0.1, 0.4, 0.8, 0)
        
        # Sub bass on 1st beat of bar
        if b % 4 == 0:
            bass = np.sin(2*np.pi*55*t_p) * envelope(t_p, 0.05, 0.45) * 0.4
            pad += bass
            
        end_idx = min(start_idx + pad_len, len(music))
        music[start_idx:end_idx] += pad[:end_idx-start_idx]
        
    # ADD BEAT from 14s to 95s
    if 14 <= time_sec < 95:
        if b % 2 == 0:
            # Minimal Kick
            k_len = int(0.2 * SAMPLE_RATE)
            t_k = np.linspace(0, 0.2, k_len)
            k_freq = np.linspace(100, 30, k_len)
            k_phase = np.cumsum(k_freq) / SAMPLE_RATE
            kick = np.sin(2 * np.pi * k_phase) * np.exp(-t_k * 20) * 0.5
            end_idx = min(start_idx + k_len, len(music))
            music[start_idx:end_idx] += kick[:end_idx-start_idx]
        else:
            # Soft Hat
            h_len = int(0.05 * SAMPLE_RATE)
            t_h = np.linspace(0, 0.05, h_len)
            hat = np.random.uniform(-1, 1, h_len) * np.exp(-t_h * 40)
            for i in range(1, len(hat)):
                hat[i] = hat[i] - hat[i-1] # Highpass
            end_idx = min(start_idx + h_len, len(music))
            music[start_idx:end_idx] += hat[:end_idx-start_idx] * 0.15

# Decisive end note at 98s
end_idx = int(98 * SAMPLE_RATE)
t_end = np.linspace(0, 4.0, int(4.0 * SAMPLE_RATE))
end_note = (np.sin(2*np.pi*220*t_end) + np.sin(2*np.pi*440*t_end)) * np.exp(-t_end) * 0.3
limit = min(end_idx + len(end_note), len(music))
music[end_idx:limit] += end_note[:limit-end_idx]

# Global fade in (1s) and fade out (3s from 101s to 104s)
global_env = np.ones_like(music)
fade_in_samples = int(1.0 * SAMPLE_RATE)
global_env[:fade_in_samples] = np.linspace(0, 1, fade_in_samples)
fade_out_samples = int(3.0 * SAMPLE_RATE)
global_env[-fade_out_samples:] = np.linspace(1, 0, fade_out_samples)

save_wav('music.wav', music * global_env * 0.15) # Very low base volume

print("Minimal professional audio generated!")
